import { createServer } from "http";
import {Server} from "socket.io";
import dotenv from "dotenv"
import express from "express";
dotenv.config()

const PORT =  process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const GLOBALROOMID = process.env.GLOBALROOMID || "1234";

interface playerContext {
    id: number;
    x: number;
    y: number;
}


interface dataprop {
    roomId: number;
    user: { name: string; id: number };
    playerCoordinates: { x: number; y: number };
}


let playersPositionContext: playerContext[] = [];

const io = new Server(httpServer, {
    cors: {
        methods: "*",
        origin: "*"
    }
})

app.get("/health", (req, res)=>{
    res.json({status: 200, success: true, health: "OK"})
})


io.on("connection", (socket)=>{
    socket.on("join", (data)=>{
        console.log(`${data.user.name} Joined the Room ${data.roomId}`)
        socket.join(data.roomId)
        io.to(data.roomId).except(socket.id).emit('join', data)
        io.to(data.roomId).emit("message", {type: "message", message: `${data.user.name} Joined the Room ${data.roomId}`})
    })

    socket.on('player-moved', (data: dataprop)=>{
        let selectPlayer: playerContext = {id: -1, x: -1, y: -1};
        let index = -1;
        playersPositionContext.forEach((player, i)=>{
            if(player.id as number == data.user.id as number){
                selectPlayer = player;
                index=i;
            }
        })
        
        selectPlayer.x = data.playerCoordinates.x;
        selectPlayer.y = data.playerCoordinates.y;

        playersPositionContext[index] = selectPlayer;
        console.log(playersPositionContext);
        io.to(data.roomId+"").except(socket.id).emit('player-moved', data);
    })
    console.log("connected");
})

// io.on("disconnect", ()=>console.log("disconnected "))

httpServer.listen(PORT, ()=>console.log("Listening at PORT 3000"));