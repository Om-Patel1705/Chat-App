import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../../context/chatProvider";
import "../../index.css";
import { useState } from "react";
import CryptoJS from "crypto-js";
// const { config } = require("dotenv");
// require("dotenv").config();
// config();

const ScrollableChat = ({ messages }) => {
  const [lastDate, setLastDate] = useState();
  const { user } = ChatState();

  //   const newm = messages;
  //     newm.map((i,m)=>{
  //       const byt =CryptoJS.AES.decrypt(m.content,process.env.REACT_APP_MESSAGE_SECRET);
  //       const x = JSON.parse(byt.toString(CryptoJS.enc.Utf8))
  //        newm.content = x;

  //     })
  // console.log(newm);

  for (var i = 1; i < messages.length; i++) {
    try {
      const byt = CryptoJS.AES.decrypt(
        messages[i].content,
        process.env.REACT_APP_MESSAGE_SECRET
      );
      const x = JSON.parse(byt.toString(CryptoJS.enc.Utf8));
      messages[i].content = x;
    } catch (err) {}
  }

  const xx = "     ";

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m.id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.username} placement="bottom-start" hasArrow>
                <div
                  className="xx"
                  style={{
                    // paddingTop:isSameUser(messages, m, i, user._id) ? 3 : 0,
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 12,
                  }}
                >
                  <Avatar
                  
                    mr={1}
                    
                    size="sm"
                    cursor="pointer"
                    name={m.username}
                    src={m.pic}
                  />
                </div>
              </Tooltip>
            )}
            <span
              className="shadow"
              style={{
                backgroundColor: `${
                  m.senderid === user._id ? "#97d9ff" : "#97f3bb"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 15,
                marginBottom: isSameUser(messages, m, i, user._id) ? 0 : 0,
                borderRadius: "6px",
                padding: "5px 15px",
                maxWidth: "75%",
                paddingRight: "50px",
              }}
            >
              {m.content}
              <span>{xx}</span>
              <span className="time">{m.time}</span>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
