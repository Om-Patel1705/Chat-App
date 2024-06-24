import { Box, Button, Center, Container, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import "../index.css";
import { Divider } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";


function Home() {

  const navigate = useNavigate();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user) navigate('/chats')
  },[navigate]);


  return (
    <Container maxW="xl" centerContent>
    <div className="mainbox">
      <Box
        className="upperbox"
        display="flex"
        justifyContent="center"
        p={3}
        backgroundColor={"White"}
        width="100%"
        textAlign={"center"}
      >
        {/* fontFamily={"work sans"} */}
        <Text fontSize={"3xl"} fontFamily={"Nunito"} >Chat-App</Text>
      </Box>
      <Divider orientation='horizontal' />
      <Box
        className="lowerbox"
        width={"100%"}
        bg={"White"}
        borderRadius={9}
        p={4}
      >
        <Tabs variant="soft-rounded">
          <TabList justifyContent={"center"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      </div>
    </Container>
  );
}

export default Home;
