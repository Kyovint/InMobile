import { useState } from "react";
import {
  Flex,Box,
  FormControl,FormLabel,
  Input,Checkbox,
  Stack,Link,
  Button,Heading,useColorModeValue,
  Text,IconButton, Icon
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";
import {db} from "../utils/firebase"
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import {auth, uploadUserInformation} from "../utils/firebase"
import {signInWithPopup, GoogleAuthProvider} from "firebase/auth"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useRouter} from 'next/router'

export default function LoginForm() {
  const formBackground = useColorModeValue("white", "gray.800");
  const buttonColor = useColorModeValue("white", "gray.800");
  const buttonBg = useColorModeValue("blue.500", "blue.300");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.400");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const googleAuth = new GoogleAuthProvider()
  const [user, loading] = useAuthState(auth)

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  };

  if(loading){
    return <p>Loading...</p>
  }


  if(user){
    router.push("/")
    return <p>You are logged in, {user.displayName}</p>
  }
  
  
  const signIn = async () =>{
    const result = await signInWithPopup(auth, googleAuth);
    console.log(result.user)

    const LoggingUser = {
      displayName: result.user.displayName,
      email: result.user.email,
      phoneNumber: null,
      photoURL: result.user.photoURL,
      uid: result.user.uid,
    }

    var userExists = []
    const Actualquery = query(collection(db, "users"), where("uid", "==", `${result.user.uid}`));
    await getDocs(Actualquery).then((snapshot) => {
      const userInfoInDatabase = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      userExists = userInfoInDatabase
    });
    if(userExists.length = 0){
      await uploadUserInformation(LoggingUser, result.user.uid)
    }
  }

  

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Box
        rounded={"md"}
        boxShadow={"lg"}
        p={5}
        maxW={"md"}
        w={"full"}
        bg={"gray.100"}
      >
        <Stack spacing={6} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} color={"blue.500"} position="relative">
              <Text
                as="span"
                bgGradient="linear(to-r, blue.500, purple.500)"
                bgClip="text"
              >
                S
              </Text>
              <Text
                as="span"
                bgGradient="linear(to-r, green.500, teal.500)"
                bgClip="text"
              >
                i
              </Text>
              <Text
                as="span"
                bgGradient="linear(to-r, yellow.500, orange.500)"
                bgClip="text"
              >
                g
              </Text>
              <Text
                as="span"
                bgGradient="linear(to-r, red.500, pink.500)"
                bgClip="text"
              >
                n
              </Text>{" "}
              in to your account
            </Heading>
          </Stack>
          <Button
            color={buttonColor}
            bg={"red.500"}
            _hover={{ bg: buttonHoverBg }}
            isLoading={isLoading}
            loadingText="Signing in..."
            onClick={signIn}
          >
            <Icon as={FaGoogle} boxSize={6} mr={2} />
            Sign in with Google
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
}