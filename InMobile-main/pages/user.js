import { useState, useEffect} from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Flex, Box, Text, Button, Divider } from '@chakra-ui/react';
import {
  Avatar,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";
import Property from '../components/Property';

import {auth, db} from "../utils/firebase"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useRouter} from 'next/router'
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";


const ProfilePage = () => {
  
  const [user, loading] = useAuthState(auth)
  const [phone, setPhone] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const [currentUser, setCurrentUser] = useState()
  const [properties, setproperties] = useState([]);
  const router = useRouter();
  
  if(!user){
    router.push('/')
  }

  useEffect(() => {
    const Actualquery = query(collection(db, "properties"), where("userId", "==", `${user.uid}`));
    getDocs(Actualquery).then((snapshot) => {
      const userPropertiesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setproperties(userPropertiesData);
    });

    const userQuery = query(collection(db, "users"), where("uid", "==", `${user.uid}`));
    getDocs(userQuery).then((snapshot) => {
      const userDataSnaphot = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCurrentUser(userDataSnaphot);
      if(userDataSnaphot[0].phoneNumber == null){
        setPhone(0)
        setIsEditing(true)
      }else{
        setPhone(userDataSnaphot[0].phoneNumber)
      }
    });
  }, [user.uid]);

  const handleSaveChanges = async() => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      phoneNumber: phone
    });
    setIsEditing(false);
  };

  return (
    <Box>
      <Flex align="center" justify="center" direction="column" my={8}>
        <Avatar size="2xl" name={user.displayName} src={user.photoURL} />
        {isEditing ? (
          <Box mt={4}>
            <FormControl id="phone" isRequired mt={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormControl>
            <Button mt={4} onClick={handleSaveChanges}>
              Guardar Celular
            </Button>
          </Box>
        ) : (
          <>
            <Text mt={4} fontSize="xl" fontWeight="bold">
              {user.displayName}
            </Text>
            <Text mt={2} fontSize="lg" color="gray.500">
              {user.email}
            </Text>
            <Text mt={1} fontSize="lg" color="gray.500">
              {user.phoneNumber}
            </Text>
            <Text mt={1} fontSize="lg" color="gray.500">
              Bogotá
            </Text>
            <Button mt={4} onClick={() => setIsEditing(true)}>
              Editar Numero de Teléfono
            </Button>
          </>
        )}
      </Flex>
      <Divider my={8} />
      <h2>Mis propiedades</h2>
      {properties != 0 && (
        <Flex flexWrap="wrap" justifyContent="center" alignItems="center" >
        {properties.map((property) => <Property property={property} key={property.id} />)}
        </Flex> 
      )}
      {properties == 0 && (
        <Flex>
          <h2>No se encontraron propiedades</h2>
          <Button
        colorScheme="red"
        size="lg"
        mt="2rem"
      >
        Subir una propiedad
      </Button>
        </Flex>
      )}
    </Box>
  );

};

export default ProfilePage;
