import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
//import NotificationBadge from "react-notification-badge";
//import { Effect } from "react-notification-badge";
//  import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/userListItem";
import { ChatState } from "../../context/chatProvider";
import Image1 from "./chat-bubble.png";
import { json, useNavigate } from "react-router-dom";
import chatlogo from "../../utils/reshot-icon-messenger-82S9U6ZBLD.svg";
import { io } from "socket.io-client";
import { dotStream } from "ldrs";

dotStream.register();
// const ENDPOINT = `http://localhost:3001`;
const ENDPOINT = "https://chat-app-j34h.onrender.com";
var socket, selectedChatCompare;

function SideDrawer({ fetchAgain, setFetchAgain }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();


  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };


  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => { setSocketConnected(true) });

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = async (query) => {
    setSearch(query);

    //  if (!search) {
    //   toast({
    //     title: "Please Enter something in search",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "top-left",
    //   });
    //   return;
    // }

    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${ENDPOINT}/api/chat/search`,
        { searchUser: query, user: user },
        config
      );
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const accessChat = async (receiveruser) => {
    var f = 0;

    chats.forEach((chat) => {
      if (!chat.isgroup) {
        if (
          chat.users[0].id == receiveruser.id ||
          chat.users[1].id == receiveruser.id
        )
          f = 1;
      }
    });

    if (f) {
      toast({
        title: "User is already in your inbox",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      var { data } = await axios.post(
        `${ENDPOINT}/api/chat/`,
        { receiveruser, user, chats },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      // console.log(data);

      const tempdata = {
        id: data.latestmessage,
        senderid: data.id,
        content: data.content,
        time: data.time,
        chatid: data.chatid,
      };

      const selectedChat = data;


data = tempdata;
      socket.emit("newMessage", { data, selectedChat });

      setLoadingChat(false);
      setSearchResult([]);
      setSearch("");
      setFetchAgain(!fetchAgain);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  


  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Box  boxSize="40px">
        <img className="llll" src={Image1}  alt="Example" />
        </Box>
        <div>
          <Menu>
            {/* <MenuButton p={1}>
              {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              /> 
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton> */}
            {/* <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u.id}
                  user={u}
                  handleFunction={() => accessChat(u)}
                />
              ))
            )}
            {loadingChat &&  
            <Box    alignSelf="center"
                margin="auto">
                <l-dot-stream
                  size="100"
                  speed="2.5"
                  color="white"
                ></l-dot-stream>
              </Box>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
