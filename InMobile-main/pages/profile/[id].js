import { useState, useEffect} from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Flex, Box, Text, Button, Divider } from '@chakra-ui/react';
import {Avatar,SimpleGrid,FormControl,FormLabel,Input} from "@chakra-ui/react";
import Property from '../../components/Property';

import {auth, db} from "../../utils/firebase"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useRouter} from 'next/router'
import { collection, query, where, getDocs } from "firebase/firestore";

const ProfilePage = (data) => {

  return (
    <Box>
      <Flex align="center" justify="center" direction="column" my={8}>
        <Avatar size="2xl" name={data.user[0].displayName} src={data.user[0].photoURL} />
        <Text mt={4} fontSize="xl" fontWeight="bold">
              {data.user[0].displayName}
            </Text>
            <Text mt={2} fontSize="lg" color="gray.500">
              {data.user[0].email}
            </Text>
            <Text mt={1} fontSize="lg" color="gray.500">
              {data.user[0].phoneNumber}
            </Text>
            <Text mt={1} fontSize="lg" color="gray.500">
              Bogotá
            </Text>
      </Flex>
      <Divider my={8} />
      <h2>Propiedades de {data.user[0].displayName}</h2>
      {data.properties[0] != 0 && (
        <Flex flexWrap="wrap" justifyContent="center" alignItems="center" >
        {data.properties[0].map((property) => <Property property={property} key={property.id} />)}
        </Flex> 
      )}
      {data.properties[0] == 0 && (
        <Flex>
          <h2>No se encontraron propiedades</h2>
          <Button
        colorScheme="red"
        size="lg"
        mt="2rem"
        onClick={() => console.log(nuevoObjeto)}
      >
        Subir una propiedad
      </Button>
        </Flex>
      )}
    </Box>
  );

};

export default ProfilePage;


export async function getServerSideProps({params}) {
  
  const id = params.id;
  var selectedUser = []
  var userProperties = []

  const userQuery = query(collection(db, "users"), where("uid", "==", `${id}`));
  await getDocs(userQuery).then((snapshot) => {
    const actualUser = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    selectedUser.push(actualUser[0])
  });

  const propertyQuery = query(collection(db, "properties"), where("userId", "==", `${id}`));
  await getDocs(propertyQuery).then((snapshot) => {
    const actualProperty = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    userProperties.push(actualProperty)
  });

  return {
    props: {
      user: selectedUser,
      properties: userProperties
    }
  }
}