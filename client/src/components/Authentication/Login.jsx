import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import "../../index.css";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [show, setshow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setshow(!show);

  const enter =(event)=>{
    if(event.key==`Enter`)
      handleSubmit();
  }

  const handleSubmit = async () => {
    
      setLoading(true);
    if (!email || !password) {
      toast({
        title: "Failed",
        description: "Please fill all inputs.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log("Please fill all inputs.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://chat-app-j34h.onrender.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        localStorage.removeItem("userInfo");

        localStorage.setItem("userInfo", JSON.stringify(data));

        console.log("Success");
        setLoading(false);
        navigate("/chats");
      } else {
        toast({
          title: "Failed",
          description: data.message,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.log(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed",
        description: "Something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log("Catched error");
      setLoading(false);
    }

  };

  return (
    <VStack spacing={5} onKeyDown={enter}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            pr="4.5rem"
            placeholder="Enter Your Password"
            type={show ? "text" : "password"}
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              colorScheme={show ? "blue" : "red"}
              h="1.75rem"
              size="sm"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        onClick={handleSubmit}
        width={"100%"}
        borderRadius={7}
        colorScheme={"blue"}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
}

export default Login;
