import React, { Component, useState } from "react";
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
import { Cloudinary, CloudinaryImage } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { image } from "@cloudinary/url-gen/qualifiers/source";
import { useNavigate } from "react-router-dom";


function Signup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [show, setshow] = useState(false);
  const [pic, setPic] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setshow(!show);
  const postDetails = (pics) => {};
  const handleSubmit = async () => {
    setLoading(true);

    if(!email || !name  || !password || !confirmpassword ){
      toast({
        title: 'Failed',
        description: "Please fill all inputs.",
        status:  "error",
        duration: 9000,
        isClosable: true,
      })
      console.log("Please fill all inputs.");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Warning",
        description: "Password doesn't match.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      console.log("Password doesn't match.");
      setLoading(false);
      return;
    }
    try {
     
      const response = await fetch("https://chat-app-j34h.onrender.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

     
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.removeItem("userInfo");
       

        console.log(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
     



        setLoading(false);
        toast({
          title: "SignUp Successful",
          description: `Welcome, ${data.name}!`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        navigate("/chats");

      } else {
        console.log(data);
        toast({
          title: "Failed",
          description: data,
          status: "error",
          duration: 9000,
          isClosable: true,
        });

        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
   

      setLoading(false);
    }
  };

  return (
    <VStack spacing={5}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setname(e.target.value)}
        />
      </FormControl>
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

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            pr="4.5rem"
            placeholder="Enter Confirm Password"
            type={show ? "text" : "password"}
            onChange={(e) => setConfirmpassword(e.target.value)}
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
      <FormControl id="name" isRequired>
        <FormLabel>Upload Your Image</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        width={"100%"}
        borderRadius={7}
        colorScheme={"blue"}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
}

export default Signup;
