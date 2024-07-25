import React, { useState, useEffect } from 'react';
import { ChatState } from "../../context/chatProvider";
import { Text } from '@chakra-ui/react';



const Getsender = ( chatid ) => {
  const { user } = ChatState();

  if(chatid.users.length == 1)return chatid.users[0].username;

   return chatid.users[0].id === user._id?chatid.users[1].username : chatid.users[0].username ;
};

const GetsenderFull = ( chatid ) => {
  const { user } = ChatState();
 
  if(chatid.users.length == 1)return chatid.users[0];
  return chatid.users[0].id === user._id?chatid.users[1] : chatid.users[0] ;

};


const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].senderid !== userId &&
    messages[messages.length - 1].senderid
  );
};


 const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].senderid !== m.senderid ||
      messages[i + 1].senderid === undefined) &&
    messages[i].senderid !== userId
  );
};

 const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].senderid === m.senderid;
};


 const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].senderid === m.senderid &&
    messages[i].senderid !== userId
  )
    return 36;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].senderid !== m.senderid &&
      messages[i].senderid !== userId) ||
    (i === messages.length - 1 && messages[i].senderid !== userId)
  )
    return 0;
  else return "auto";
};

export {Getsender,GetsenderFull,isLastMessage,isSameSender,isSameSenderMargin,isSameUser};
