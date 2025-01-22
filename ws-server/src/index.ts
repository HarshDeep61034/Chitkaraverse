import { createServer } from "http";
import {Server} from "socket.io";
import dotenv from "dotenv"
import express from "express";
dotenv.config()

const PORT =  process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const GLOBALROOMID = process.env.GLOBALROOMID || "1234";

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

    console.log("connected");
})

// io.on("disconnect", ()=>console.log("disconnected "))

httpServer.listen(PORT, ()=>console.log("Listening at PORT 3000"));