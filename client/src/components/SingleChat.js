import React, { useEffect, useState } from "react";
import "../index.css";
import {
  FormControl,
  IconButton,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import { Box, Text } from "@chakra-ui/react";
import { Getsender, GetsenderFull } from "./config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import { Image } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./userAvatar/ScrollableChat";
import Lottie from "react-lottie";
import axios from "axios";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [Image1, seIm] = useState(
    "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png?w=128"
  );
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    console.log("Updated messages:", messages);
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:3001/api/message/all",
        { selectedChat },
        config
      );

      console.log("Fetched messages:", data);
      setMessages(data);
      setLoading(false);

      // socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          "http://localhost:3001/api/message/",
          {
            content: newMessage,
            chatId: selectedChat,
            sender: user,
          },
          config
        );

        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const defaultOptions = () => {
    return;
  };

  const typingHandler = (event) => {
    setNewMessage(event.target.value);

    // if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      // socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        // socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    setMessages([]);
    fetchMessages();

    // selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

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
              <>
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
                <div className="photo">
                  <ProfileModal user={GetsenderFull(selectedChat)} />
                </div>
              </>
            ) : (
              <>
                <Image
                  ml={2}
                  mr={2}
                  className="llll"
                  borderRadius="full"
                  boxSize="50px"
                  src={Image1}
                  alt={"Group"}
                />

                {selectedChat.chatname}
                <div className="photo">
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </div>
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
            overflowY="scroll"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text>Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
