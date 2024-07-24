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
import ImageB from "./chat-bubble.png";
import imageCompression from "browser-image-compression";

// const ENDPOINT = `http://localhost:3001`;
const ENDPOINT = "https://chat-app-j34h.onrender.com";

function Signup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [show, setshow] = useState(false);
  const [pic, setPic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState();
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setshow(!show);
  const postDetails = async (pics) => {
    if (!pics) {
      toast({
        title: "Error",
        description: "No file selected.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
  
    console.log("File received:", pics);
    console.log("File type:", pics.type);
    console.log("File instance of File:", pics instanceof File);
    console.log("File instance of Blob:", pics instanceof Blob);
  
    const options = {
      maxSizeMB: 0.02,
      maxWidthOrHeight: 250,
      useWebWorker: true,
    };
  
    try {
      const compressedFile = await imageCompression(pics, options);
      console.log("Compressed file instance of Blob:", compressedFile instanceof Blob);
      console.log(`Compressed file size: ${compressedFile.size / 1024 / 1024} MB`);
  
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        const result = reader.result;
        setPreview(result);
        console.log("File preview result:", result);
  
        try {
          // await uploadToServer(compressedFile); // write your own logic
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };
  
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing file:", error);
      toast({
        title: "Error",
        description: "Error compressing file.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  
  const enter = (event) => {
    if (event.key == `Enter`) handleSubmit();
  };
  const enter2 = (event) => {
    if (event.key == `Enter`) handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!email || !name || !password || !confirmpassword) {
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
      const response = await fetch(`${ENDPOINT}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, preview }),
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
    <VStack spacing={5} >
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setname(e.target.value)}
          onKeyDown={enter}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setemail(e.target.value)}
          onKeyDown={enter}
        />
      </FormControl>
      <FormControl id="name" isRequired>
        <FormLabel>Upload Your Image</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
          onKeyDown={enter}
          
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
            onKeyDown={enter}
          />
          <InputRightElement width="4.5rem">
            <Button
              colorScheme={show ? "blue" : "red"}
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              onKeyDown={enter}
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
            onKeyDown={enter}
          />
          <InputRightElement width="4.5rem">
            <Button
              colorScheme={show ? "blue" : "red"}
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              onKeyDown={enter}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
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
