import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import React, { useState, useEffect, startTransition } from 'react';
//import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
//import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider.js";
import { Getsender } from "./config/ChatLogics.js";
const MyChats = ({ fetchAgain }) => {

 
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [chatnames, setChatnames] = useState([]);

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("http://localhost:3001/api/chat/load", config);
      setChats(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const listUsers = async (chatID) => {
    try {

      
      const response = await fetch("http://localhost:3001/api/chat/listout",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          authorization:`Bearer ${user.token}`
        },
        body:JSON.stringify({user}),
      })
const data = await response.json();
     // console.log(data);
      startTransition(() => {

        setChatnames(data);
      });
    } catch (error) {
      console.error('Error fetching chatnames:', error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user);
     
      listUsers(user); // Assuming chatID is available in the user object
    }
  }, [user]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        {/* <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal> */}
        {/* <ul>
          {chatnames.map((chat, index) => (
            <li key={index}>{chat.chatname}</li>
          ))}
        </ul> */}
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chatnames ? (
          <Stack overflowY="scroll">
            {chatnames.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat.chatid}
              >
                <Text>
                  {!chat.isgroup
                    ?<Getsender chatid={chat.chatid}/>
                    : chat.chatname}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;