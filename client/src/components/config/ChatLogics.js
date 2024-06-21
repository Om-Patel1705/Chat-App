import React, { useState, useEffect } from 'react';
import { ChatState } from "../../context/chatProvider";
import { Text } from '@chakra-ui/react';



const Getsender = ( chatid ) => {
  const { user } = ChatState();

   return chatid.users[0].id === user._id?chatid.users[1].username : chatid.users[0].username ;
};

const GetsenderFull = ( chatid ) => {
  const { user } = ChatState();
 
  return chatid.users[0].id === user._id?chatid.users[1] : chatid.users[0] ;

};

export {Getsender,GetsenderFull};
