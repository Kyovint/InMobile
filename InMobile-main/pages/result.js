import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import { Flex, Box, Heading, Card, Text} from '@chakra-ui/react';
import Property from '../components/Property';
import {
    Button
  } from "@chakra-ui/react";

const ProfilePage = ({firstRecomendation, secondRecomendation, thirdRecomendation}) => {

  return (
<Card>
  <Box p={4}>
    <Heading as="h1" textAlign="center" mb={4}>
      Estos son los resultados que te damos acorde a tus selecciones
    </Heading>
    <Text textAlign="center" mb={2}>
    Aquí tienes una increíble selección de propiedades impresionantes que hemos elegido cuidadosamente con nuestra avanzada tecnología de inteligencia artificial. Estamos emocionados de mostrarte estas opciones asombrosas que seguramente te dejarán sin aliento.
    </Text>
    <Flex justifyContent="center" alignItems="center">
      <Property property={firstRecomendation} />
      <Property property={secondRecomendation} />
      <Property property={thirdRecomendation} />
    </Flex>
  </Box>
</Card>
  );

};

export async function getServerSideProps({ query }) {
    let objeto = null;
    try {
        const objetoString = decodeURIComponent(query.answers);
        objeto = JSON.parse(objetoString);
    } catch (error) {
        console.error('Error al analizar el objeto JSON:', error);
    }

    //console.log(objeto); // Verifica si el objeto se está recibiendo correctamente

    const idsPropertiesRecomended = await fetch('http://127.0.0.1:5001/inmobile/v1/users',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(objeto)
    }).then(function (response){
      if(response.ok){
        return response.json()
      }
    });

    const firstRecomendation = await fetchApi(`http://127.0.0.1:5000/inmobile/v1/properties/details?id=${idsPropertiesRecomended.firstRecomendation}`);
    const secondRecomendation = await fetchApi(`http://127.0.0.1:5000/inmobile/v1/properties/details?id=${idsPropertiesRecomended.secondRecomendation}`);
    const thirdRecomendation = await fetchApi(`http://127.0.0.1:5000/inmobile/v1/properties/details?id=${idsPropertiesRecomended.thirdRecomendation}`);

    console.log(idsPropertiesRecomended)

    return {
        props: {
          firstRecomendation,
          secondRecomendation,
          thirdRecomendation
        },
    };
}

export default ProfilePage;