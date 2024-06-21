import { Box, Button, Container, Divider, FormControl, FormLabel, Input } from '@chakra-ui/react';

import React, { Component ,useState,useEffect} from 'react'
import io from "socket.io-client";
import { ChatState } from '../context/chatProvider';
import Chatbox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useToast } from '@chakra-ui/react';
import axios from 'axios';



function Chats() {

  const [fetchAgain, setFetchAgain] = useState(false);
  const {user} = ChatState();
  const toast = useToast();
// console.log(user);
//  const x=user;


//  useEffect(()=>{

//   async function fetchChat(){
//    // const {user} = ChatState();
//    try {
//     const user = localStorage.getItem("userInfo");
//      const x =JSON.parse(user);
//     console.log(x.token);
//     const h = "YASHMC!!";
//     console.log(h);
  

//     //const { data } = await axios.post("http://localhost:3001/api/chat/", config);
//     //setChats(data);

//     const response = await fetch("http://localhost:3001/api/chat/load",{
//       method:"POST",
//       headers:{
//         "Content-Type":"application/json",
//         authorization:`Bearer ${x.token}`
//       },
//       body:JSON.stringify(x),
//     })

   
//   } catch (error) {
//     toast({
//       title: "Error Occured!",
//       description: "Failed to Load the chats",
//       status: "error",
//       duration: 5000,
//       isClosable: true,
//       position: "bottom-left",
//     });
//   }
//   }
  
//   fetchChat();

//  },[user]);
 
  
    return (
      <div style={{ width: "100%" }}>

   
      {user && <SideDrawer />}
     
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
       { user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        
      </Box>
    </div>
    )
  
}

export default Chats