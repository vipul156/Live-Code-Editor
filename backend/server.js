import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server"

const app = express();
const http = createServer(app);

app.use(express.static("public"))

const io = new Server(http,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

const ysocket = new YSocketIO(io)
ysocket.initialize();


app.get("/health",(req,res)=>{
    res.status(200).json({
        message : "ok",
        success : true
    })
});


http.listen(8000,()=>{
    console.log("Server is running on port 8000");
});