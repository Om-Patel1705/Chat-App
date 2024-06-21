import React, { useState, useEffect } from 'react';
import { ChatState } from "../../context/chatProvider";

const Getsender = ({ chatid }) => {
  const { user } = ChatState();
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    const fetchSenderName = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/chat/isgroup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ chatid }),
        });

        const data = await response.json();
        const sender = data[0].id !== user._id ? data[0].username : data[1].username;
        setSenderName(sender);
      } catch (error) {
        console.error("Error fetching sender name:", error);
      }
    };

    fetchSenderName();
  }, [chatid, user.token, user._id]);
console.log(senderName);
  return <>{senderName}</>;
};

export {Getsender};
