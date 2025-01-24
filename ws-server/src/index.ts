import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const GLOBALROOMID = process.env.GLOBALROOMID || "1234";

interface dataprop {
  roomId: number;
  user: { name: string; id: number };
  playerCoordinates: { x: number; y: number };
}

let playersPositionContext = new Map<number, { x: number; y: number, socketId: string }>();

const io = new Server(httpServer, {
  cors: {
    methods: "*",
    origin: "*",
  },
});

app.get("/health", (req, res) => {
  res.json({ status: 200, success: true, health: "OK" });
});

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    console.log(`${data.user.name} Joined the Room ${data.roomId}`);
    socket.join(data.roomId);

    const playersPos = Array.from(playersPositionContext.entries()).map(([id, pos]) => ({
        roomId: data.roomId, // Use the roomId from the join data
        user: { name: `Player${id}`, id }, // You might want to adjust this based on your actual user data
        playerCoordinates: { x: pos.x, y: pos.y },
    }));

    console.log("Players Position Context:", playersPos); // Log the data being sent

    io.to(socket.id).emit("players-context", playersPos);
    io.to(data.roomId).except(socket.id).emit("join", data);
    io.to(data.roomId).emit("message", {
      type: "message",
      message: `${data.user.name} Joined the Room ${data.roomId}`,
    });
  });

  socket.on("player-moved", (data: dataprop) => {
    if (playersPositionContext.get(data.user.id)) {
      let player = playersPositionContext.get(data.user.id);
      player!.x = data.playerCoordinates.x;
      player!.y = data.playerCoordinates.y;
      playersPositionContext.set(data.user.id, player!);
    } else {
      playersPositionContext.set(data.user.id, { x: 200, y: 128, socketId: socket.id });
    }
    
    io.to(data.roomId + "")
      .except(socket.id)
      .emit("player-moved", data);
  });
  console.log("connected");

  socket.on("disconnect", () => {
    // Remove player by socket ID
    for (let [userId, pos] of playersPositionContext.entries()) {
      if (pos.socketId === socket.id) {
        playersPositionContext.delete(userId); // Remove player by user ID
        console.log(`Player with ID ${userId} and Socket ID ${socket.id} has disconnected and been removed from context.`);
        break; // Exit loop after finding and removing the player
      }
    }
  });


  console.log("connected");
});

// io.on("disconnect", ()=>console.log("disconnected "))

httpServer.listen(PORT, () => console.log("Listening at PORT 3000"));
