import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { Image } from "@chakra-ui/react";
//import {Image1} from "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
import React, { useState, useEffect, startTransition } from "react";
//import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import "../index.css"
//import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider.js";
import { Getsender, GetsenderFull } from "./config/ChatLogics.js";
import GroupChatModal from "./miscellaneous/GroupChatModal.js";
const MyChats = ({ fetchAgain }) => {
  const you = "You";
  const [loggedUser, setLoggedUser] = useState();
  const [Image1, seIm] = useState(
    "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png?w=128"
  );
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

      const { data } = await axios.post(
        "http://localhost:3001/api/chat/load",
        config
      );
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

  const listUsers = async () => {

    try {
      const response = await fetch("http://localhost:3001/api/chat/listout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ user }),
      });
      const data = await response.json();
       console.log(data);
      startTransition(() => {
        setChatnames(data);
        setChats(data);

      });
    } catch (error) {
      
      console.error("Error fetching chatnames:", error);
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

  useEffect(() => {
    setLoggedUser(user);
    listUsers();
  }, [fetchAgain,user]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
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
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
        {/* <ul>
          {chatnames.map((chat, index) => (
            <li key={index}>{chat.chatname}</li>
          ))}
        </ul> */}
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <>
                <Box
                  display="flex"
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat.chatid}
                >
                  {!chat.isgroup ? (
                    <Image
                    className="llll"
                      borderRadius="full"
                      boxSize="50px"
                      src={GetsenderFull(chat).pic}
                      alt={GetsenderFull(chat).username}
                    />
                  ) : (
                    <Image
                    className="llll"
                      borderRadius="full"
                      boxSize="50px"
                      src={Image1}
                      alt={"Group"}
                    />
                  )}
                  <Box display="flex" flexDir="column" ml="15px">
                    {" "}
                    <Text mt="4px" mb="2px">
                      {!chat.isgroup ? <>{Getsender(chat)}</> : chat.chatname}
                    </Text>
                    {chat.latestmessage && (
                      <Text fontSize="xs">
                        <b>
                          {chat.username == user.name ? (
                            you
                          ) : (
                            <>{Getsender(chat)}</>
                          )}{" "}
                          :{" "}
                        </b>
                        {chat.content.length > 30
                          ? chat.content.substring(0, 30) + "..."
                          : chat.content}
                      </Text>
                    )}
                  </Box>
                </Box>
              </>
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
