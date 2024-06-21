import React from "react";
import "../index.css";
import { IconButton } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import { Box, Text } from "@chakra-ui/react";
import { Getsender, GetsenderFull } from "./config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import { Image } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  return (


    
    <>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
           
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "even-between" }}
            alignItems="center"
          >
          
            <IconButton
             ml={2}
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isgroup ? (
              < >
              <Image
              
               ml={2}
               mr={2}
               className="llll"

               
              borderRadius="full"
              boxSize="50px"
              src={GetsenderFull(selectedChat).pic}
              alt={GetsenderFull(selectedChat).username}
            />
                {GetsenderFull(selectedChat).username}
               <div className="photo"> <ProfileModal
                    user={GetsenderFull(selectedChat)}
                  /></div>
               </>
            ) : (
              <>
                {selectedChat.chatname}
                {/* <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain} */}
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          ></Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text>Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
