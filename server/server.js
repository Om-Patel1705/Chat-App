const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes=require("./Routes/userRoutes");
const chatRoutes=require("./Routes/chatRoutes");
const messageRoutes=require("./Routes/messageRoutes");
const pool = require("./config/db"); 

const authUser = require("./controller/authUser");
const { registerUser } = require("./controller/registerUser");

app.use(express.json());
const server = http.createServer(app); 
dotenv.config();
// put this near top, after dotenv.config()
const allowedOrigins = [
  "https://chat-app-psi-roan.vercel.app", // your Vercel frontend (if still used)
  "http://localhost:3000",                // local dev
  "http://127.0.0.1:3000",
  "http://3.109.155.93:3000",             // EC2 frontend IP
  "http://3.109.155.93"                   // sometimes origin may be without port
];

// Express CORS middleware (returns request origin if in list)
app.use(cors({
  origin: function(origin, callback){
    // allow non-browser requests like curl/postman (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"), false);
    }
  },
  credentials: true,
}));

// Socket.io CORS: allow same list
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed by Socket.IO"), false);
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
    socket.on("setup",(user)=>{
      // console.log(user);
      socket.join(user._id);
      socket.emit("connected");
    });

    socket.on("join chat",(room)=>{
      socket.join(room);
      console.log("User joined Room: "+ room);
    });

    socket.on("newMessage", (newMessageRecieved) => {
      var chat = newMessageRecieved;

      // console.log(chat);
  
      if (!chat.selectedChat.users) return console.log("chat.users not defined");
  // console.log(chat.selectedChat.users);
      chat.selectedChat.users.forEach((user) => {
        if (user.id == newMessageRecieved.data.senderid) return;
  
        socket.in(user.id).emit("message received", newMessageRecieved.data);
      });
    }); 
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(user._id);
    });
});
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
app.use('/api/message',messageRoutes);




const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
