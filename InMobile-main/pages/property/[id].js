import { Box, Flex, Spacer, Text } from '@chakra-ui/layout';
import { Avatar } from '@chakra-ui/avatar';
import { FaBed, FaBath } from 'react-icons/fa';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import FloatingButton from '../../components/FloatingButton';
import { BsGridFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import millify from 'millify';

import {
  Button,
  ChakraProvider,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

import { baseUrl, fetchApi } from '../../utils/fetchApi';
import ImageScrollbar from '../../components/ImageScrollbar';
import { Card, CardBody, CardHeader } from '@chakra-ui/react';

import {db} from "../../utils/firebase"
import { collection, query, where, getDocs } from "firebase/firestore";
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth} from "../../utils/firebase"
import {deleteProperty} from '../../utils/firebase';
import {useRouter} from 'next/router'

export default function PropertyDetails({idActualProperty, propertyDetails: { price, rooms, title, baths, area, stratum, description, type, garage, neighborhood, furnished, address, photos, antiquity, elevator}, owner: {id, photoURL, phoneNumber} }){

  const [user, loading] = useAuthState(auth)
  const router = useRouter();

  const deleteActualProperty = async() =>{
    await deleteProperty(idActualProperty)
    console.log(idActualProperty)
    router.push('/')
  }

  const goToEdit = async() =>{
    router.push(`/edit/${idActualProperty}`)
  }

  return(
    
    <Box maxWidth='1000px' margin='auto' p='4'>
    {photos && <ImageScrollbar data={photos} />}
    <Card marginTop="7" variant = "outline" borderRadius="40px">
    <CardHeader paddingTop="10px">
    
    <Box w='full' p='2'>
      <Flex paddingTop='2' alignItems='center'>
        <Text fontWeight='bold' fontSize='lg'>
          {title}
        </Text>
        <Spacer />
        <Link href={`/profile/${id}`}>
        
          <Avatar size='md' src={photoURL}></Avatar>

        </Link>
        {user != null && user.uid == id &&(
          <Flex>
            <Button
              colorScheme="green"
              size="lg"
              mt="0,5rem"
              onClick={goToEdit}
            >
              Editar
            </Button>

            <Button
              colorScheme="red"
              size="lg"
              mt="0,5rem"
              onClick={deleteActualProperty}
            >
              Eliminar
            </Button>
          </Flex>
        )}
      </Flex>
      <Flex alignItems='center' p='1' justifyContent='space-between' w='250px' color='blue.400'>
        {rooms}<FaBed /> | {baths} <FaBath /> | {area} m3<BsGridFill />
      </Flex>
    </Box>
    </CardHeader>


    <CardBody>
    <Box marginTop='2'>
      <Text fontSize='lg' marginBottom='2' fontWeight='bold'>{price} $</Text>
      <Text lineHeight='2' color='gray.600'>{description}</Text>
    </Box>
    <Flex flexWrap='wrap' textTransform='uppercase' justifyContent='space-between'>
      <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3'>
        <Text>Tipo</Text>
        <Text fontWeight='bold'>{type}</Text>
      </Flex>
      <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3'>
        <Text>Estrato</Text>
        <Text fontWeight='bold'>{stratum}</Text>
      </Flex>
      <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3'>
        <Text>Antigüedad</Text>
        <Text fontWeight='bold'>{antiquity} años</Text>
      </Flex>
      <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3'>
        <Text>Dirección</Text>
        <Text fontWeight='bold'>{address}</Text>
      </Flex>
      <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3'>
        <Text>Barrio</Text>
        <Text fontWeight='bold'>{neighborhood}</Text>
      </Flex>
      {garage && (
        <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3' >
          <Text>Garaje</Text>
          <Text fontWeight='bold'>Sí</Text>
        </Flex>
      )}
      {furnished && (
        <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3' >
          <Text>Amoblado</Text>
          <Text fontWeight='bold'>Sí</Text>
        </Flex>
      )}
      {elevator && (
        <Flex justifyContent='space-between' w='400px' borderBottom='1px' borderColor='gray.100' p='3' >
          <Text>Ascensor</Text>
          <Text fontWeight='bold'>Sí</Text>
        </Flex>
      )}
    </Flex>
    </CardBody>
    </Card>

    <a href={`https://wa.me/+57${phoneNumber}`}>
      <FloatingButton>
          <FaWhatsapp size={20} />
      </FloatingButton>
    </a>

  </Box>
  )
}

export async function getServerSideProps({ params: { id } }) {
  const data = await fetchApi(`http://127.0.0.1:5000/inmobile/v1/properties/details?id=${id}`);
  
  var selectedUser = []
  const userQuery = query(collection(db, "users"), where("uid", "==", `${data.userId}`));
  await getDocs(userQuery).then((snapshot) => {
    const actualUser = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    selectedUser.push(actualUser[0])
  });
  console.log(selectedUser[0])

  return {
    props: {
      propertyDetails: data,
      owner: selectedUser[0],
      idActualProperty: id
    },
  };
}