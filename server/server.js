const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes=require("./Routes/userRoutes");
const chatRoutes=require("./Routes/chatRoutes");
const pool = require("./config/db");

const authUser = require("./controller/authUser");
const { registerUser } = require("./controller/registerUser");

app.use(cors());
app.use(express.json());

const server = http.createServer(app); 

dotenv.config();

const io = new Server(server, {
  cors: {
    //origin: "https://0gbr17f6-3000.inc1.devtunnels.ms/",
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }, 
}); 

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`); 

//   socket.on("room1", (data) => {
//    // console.log(data);
//     socket.join(data);
    
//   });
//   socket.on("room2", (data) => {
//    // console.log(data);
//     socket.join(data);
    
//   });
  
//   socket.on("message1", (data) => {

//     console.log(data.message1);
//     socket.to(data.room).emit("messageToroom1",data.message1);
    
//   });
//   socket.on("message2", (data) => {
//     console.log(data.message2);
//     socket.to(data.room).emit("messageToroom2",data.message2);
    
//   });

// });
 

// app.post('/register',(req,res)=>{
//   registerUser(req,res);
// });

// app.post('/login',(req,res)=>{
//   authUser(req,res);
// });

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);




const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
