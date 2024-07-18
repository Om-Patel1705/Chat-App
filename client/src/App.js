import {  lazy } from "react";
// import io from "socket.io-client";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import Chats from "./pages/Chats";
// import env from "react-dotenv";

const Home = lazy(() => import("./pages/Home"));

//const socket = io.connect("https://0gbr17f6-3001.inc1.devtunnels.ms/");
//const socket = io.connect("https://chat-app-j34h.onrender.com");

function App() {


  return (
    
 
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
        </Routes>
      </div>
     
    
  );
}

export default App;
