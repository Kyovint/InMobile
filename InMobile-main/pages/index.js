import Link from 'next/link';
import Image from 'next/image';
import { Flex, Box, Text, Button, Divider } from '@chakra-ui/react';
import FloatingButton from '../components/FloatingButton';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import Property from '../components/Property';

import {auth, db} from "../utils/firebase"
import {useAuthState} from 'react-firebase-hooks/auth'

import { Collapse, Card } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";


function YouTubeVideo({ videoId }) {
  const playerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = initializePlayer;

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  const initializePlayer = () => {
    playerRef.current = new window.YT.Player("youtube-player", {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        loop: 1,
        controls: 0,
        modestbranding: 1,
        showinfo: 0,
        disablekb: 1,
        enablejsapi: 1,
        iv_load_policy: 3, // Oculta el título inicial y la imagen de vista previa del video
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = (event) => {
    event.target.playVideo();
    event.target.setPlaybackQuality("hd720");
    event.target.setOption("captions", "off");
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      event.target.playVideo();
    }
  };

  return (
    <div
      id="youtube-player"
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    ></div>
  );
}

const Banner = ({
  purpose,
  title1,
  title2,
  desc1,
  desc2,
  buttonText,
  linkName,
}) => {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <Flex flexWrap="wrap" justifyContent="center" alignItems="center" m="10">
      <Box
        position="relative"
        borderRadius="30px"
        overflow="hidden"
        width={500}
        height={281} // Ajusta la altura proporcionalmente al ancho para mantener la relación de aspecto del video
        objectFit="cover"
      >
        <YouTubeVideo videoId="lHOOMnYDg2g" />
      </Box>
      <Box p="5">
        <Text
          color="blue.100"
          fontSize="3xl"
          fontWeight="medium"
          id="purposeText"
          sx={{
            backgroundImage:
              "url(https://media.istockphoto.com/id/1185382671/es/vector/fondo-colorido-borroso-abstracto.jpg?s=612x612&w=0&k=20&c=MJ_7Wn1L45PM0Ilo0cgLs4h2SRRoi7rEj-Rau8tkYM8=)",
            WebkitTextFillColor: "transparent",
            WebkitBackgroundClip: "text",
          }}
        >
          {purpose}
        </Text>
        <Text fontSize="3xl" fontWeight="bold">
          {title1}
          <br />
          {title2}
        </Text>
        <Text fontSize="lg" paddingTop="3" paddingEnd="3" color="gray.700">
          {desc1}
          <br />
          {desc2}
        </Text>
        <Button
          marginTop={3}
          fontSize="xl"
          bgImage="url('https://definicion.de/wp-content/uploads/2011/01/casa-2.jpg')"
          variant="outline"
          onClick={() => setIsCardOpen(!isCardOpen)}
        >
      
            <Text
              color="gray.100"
              fontSize="1xl"
              fontWeight="Bold"
              id="purposeText"
            >
              {buttonText}
            </Text>
        
        </Button>
        <Collapse in={isCardOpen} animateOpacity>
          <Card p="5" mt="4" borderRadius="md" boxShadow="lg" bgColor={"gray.100"} maxW="md">
            <Text fontSize="lg" padding="3" color="black.100" fontWeight={"bold"}>
            Encontrar la casa perfecta puede ser abrumador, pero no te preocupes, estamos aquí para simplificar el proceso. Nuestra aplicación utiliza tecnología de vanguardia para brindarte una experiencia de búsqueda de propiedades inmobiliarias como ninguna otra.
            </Text>
          </Card>
        </Collapse>
      </Box>
    </Flex>
  );
};

export default function Home({ propertiesForSale}) {

  const [user, loading] = useAuthState(auth)

  
  return (
    <Box>
      <Divider paddingBottom={4} />
      <Banner 
      purpose='BUY A HOME'
      title1=' Find, Buy & Own Your'
      title2='Dream Home'
      desc1=' Explore from Apartments, land,'
      desc2=' villas and more'
      buttonText='Explore Buying'
      linkName='/search?purpose=for-sale'
      imageUrl='https://bayut-production.s3.eu-central-1.amazonaws.com/image/110993385/6a070e8e1bae4f7d8c1429bc303d2008'
      />
      {user && (
        <Flex>
          <Link href="/add" >
          <FloatingButton>
          <Button size="lg" aria-label="Add item" position="fixed"
            bottom={4}
            right={4}
            zIndex="docked"
            justifyContent="center"
            alignItems="center"
            width="4rem"
            height="4rem"
            borderRadius="full"
            fontSize={60}
            boxShadow="lg"
            bg="blue.200"
            color="blue">
              +
            </Button>
          </FloatingButton>
          </Link>
        </Flex>
      )}

      
  
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center" >
      {propertiesForSale.map((property) => <Property property={property} key={property.id} />)}
      </Flex>  
      <Divider/>
    </Box>   
  )
}

export async function getStaticProps() {
  const propertyForSale = await fetchApi('http://127.0.0.1:5000/inmobile/v1/properties');

  return {
    props: {
      propertiesForSale: propertyForSale,
    }
  }
}

 