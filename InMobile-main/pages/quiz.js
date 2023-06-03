import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import Question from "../components/Question";
import { baseUrl, fetchApi } from '../utils/fetchApi';
import {
  Box,
  Button,
  Text,
  ChakraProvider,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import Property from "../components/Property";
import { MdStar } from "react-icons/md";
import {useRouter} from 'next/router'

export default function Home({lowProperty, mediumProperty, highProperty}) {
  const router = useRouter();
  const [preguntas, setPreguntas] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [calificacion, setCalificacion] = useState(3);
  const [calificacion2, setCalificacion2] = useState(3);
  const [calificacion3, setCalificacion3] = useState(3); // nueva variable de estado
  const [datos, estableceDatos] = useState("");

  const hijoAPadre = (datoshijo) => {
    estableceDatos(datoshijo);
    let valores = [];
    for (let propiedad in datos) {
      valores.push(datos[propiedad]);
    }
    console.log(valores);
  };

  const nuevoObjeto = {
    rating1: datos.calificacion,
    rating2: datos.calificacion2,
    rating3: datos.calificacion3,
    salary: datos[0],
    vehicle: datos[4],
    disability: datos[2],
    peopleNumber: datos[5],
    occupation: datos[3],
    type: datos[1]
  };

  useEffect(() => {
    const questionsRef = collection(db, "preguntas");

    getDocs(questionsRef).then((snapshot) => {
      const preguntasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPreguntas(preguntasData);
    });
  }, []);

  const ejemploPropiedad = {
    photos: [
        'https://firebasestorage.googleapis.com/v0/b/inmobile-84e1a.appspot.com/o/properties%2F4dcbd2bd-21ed-4e1d-9215-827eff8746b4%2Fc5e917f0-b435-4a16-b1ca-c1fa86e68233?alt=media&token=ddf090dc-7f30-4067-98da-f925c66e0a7c',
        'https://firebasestorage.googleapis.com/v0/b/inmobile-84e1a.appspot.com/o/properties%2F4dcbd2bd-21ed-4e1d-9215-827eff8746b4%2Fc5e917f0-b435-4a16-b1ca-c1fa86e68233?alt=media&token=ddf090dc-7f30-4067-98da-f925c66e0a7c'
      ],
    price: 6999,
    rentFrequency: "monthly",
    rooms: 4,
    title: "Ejemplo de propiedad",
    baths: 1,
    area: 67.8192192,
    id: 5647678,
  };

  const handleNextQuestion = (respuesta) => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const enviar = (calificacion) => {
    const newData = {
      ...datos,
      calificacion: calificacion,
    };
    estableceDatos(newData);
  };

  const enviar2 = (calificacion2) => {
    const newData2 = {
      ...datos,
      calificacion2: calificacion2,
    };
    estableceDatos(newData2);
  };

  const enviar3 = (calificacion3) => {
    const newData3 = {
      ...datos,
      calificacion3: calificacion3,
    };
    estableceDatos(newData3);
  };

  const handleSliderChange = (value) => {
    setCalificacion(value);
  }; // controlador de eventos para actualizar la calificación del usuario

  const handleSliderChange2 = (value) => {
    setCalificacion2(value);
  };

  const handleSliderChange3 = (value) => {
    setCalificacion3(value);
  };

  function sendForm(){
    const objetoString = encodeURIComponent(JSON.stringify(nuevoObjeto));
    router.push(`/result?answers=${objetoString}`);
  }

  return (
    <ChakraProvider>
      <Box marginBottom={4}>
        {preguntas[currentQuestion] && (
          <Question
            pregunta={preguntas[currentQuestion].pregunta}
            opciones={preguntas[currentQuestion].opciones}
            handleNextQuestion={handleNextQuestion}
            hijoAPadre={hijoAPadre}
          />
        )}
      </Box>

      {datos.length == 6 && (
        <Box
          width={["100%", "80%", "50%"]}
          margin="0 auto"
          padding="2rem"
          boxShadow="lg"
          borderRadius="lg"
          backgroundColor="gray.100"
        >
          {/* Título del quiz */}
          <Text fontSize="3xl" fontWeight="bold" mb="2rem">
            ¿Qué calificacion le darias a esta casa?
          </Text>

          {/* Pregunta */}
          <Box>
            <Flex>
              <Property property={lowProperty}  key={ejemploPropiedad.id}/>
            </Flex>
            <Text fontWeight="bold" mb="1rem">
              Calificación:
            </Text>
            <Slider
              aria-label="slider-ex-1"
              defaultValue={3}
              min={1}
              max={5}
              step={1}
              onChange={handleSliderChange}
              colorScheme="blue"
              trackBorderColor="gray.200"
              trackBorderWidth="1px"
              trackHeight="8px"
              thumbBoxSize={7}
              thumbBorderColor="blue.500"
              thumbColor="white"
              thumbShadow="lg"
              thumbTransform="translate(-50%, -50%)"
              _focusThumb={{
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
              }}
              _activeThumb={{
                boxShadow: "none",
              }}
            >
              <SliderTrack bg="gray.200">
                <SliderFilledTrack bg="blue.500" />
              </SliderTrack>
              <SliderThumb boxSize={7}>
                <Box color="blue.500" as={MdStar} />
              </SliderThumb>
            </Slider>
            <Text fontWeight="bold" mt="1rem">
              {calificacion}
            </Text>
          </Box>
          {/* Botón para enviar el quiz */}
          <Button
            colorScheme="blue"
            size="lg"
            mt="2rem"
            onClick={() => enviar(calificacion)}
          >
            Enviar
          </Button>
        </Box>
      )}

      {datos.hasOwnProperty("calificacion") && !datos.hasOwnProperty("calificacion2") && (
        <Box
          width={["100%", "80%", "50%"]}
          margin="0 auto"
          padding="2rem"
          boxShadow="lg"
          borderRadius="lg"
          backgroundColor="gray.100"
        >
          {/* Título del quiz */}
          <Text fontSize="3xl" fontWeight="bold" mb="2rem">
            ¿Qué calificacion le darias a esta casa?
          </Text>

          {/* Pregunta */}
          <Box>
            <Flex>
              <Property property={mediumProperty} key={ejemploPropiedad.id}/>
            </Flex>
            <Text fontWeight="bold" mb="1rem">
              Calificación:
            </Text>
            <Slider
              aria-label="slider-ex-1"
              defaultValue={3}
              min={1}
              max={5}
              step={1}
              onChange={handleSliderChange2}
              colorScheme="blue"
              trackBorderColor="gray.200"
              trackBorderWidth="1px"
              trackHeight="8px"
              thumbBoxSize={7}
              thumbBorderColor="blue.500"
              thumbColor="white"
              thumbShadow="lg"
              thumbTransform="translate(-50%, -50%)"
              _focusThumb={{
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
              }}
              _activeThumb={{
                boxShadow: "none",
              }}
            >
              <SliderTrack bg="gray.200">
                <SliderFilledTrack bg="blue.500" />
              </SliderTrack>
              <SliderThumb boxSize={7}>
                <Box color="blue.500" as={MdStar} />
              </SliderThumb>
            </Slider>
            <Text fontWeight="bold" mt="1rem">
              {calificacion2}
            </Text>
          </Box>
          {/* Botón para enviar el quiz */}
          <Button
            colorScheme="blue"
            size="lg"
            mt="2rem"
            onClick={() => enviar2(calificacion2)}
          >
            Enviar
          </Button>
        </Box>
      )}

      {datos.hasOwnProperty("calificacion2") && !datos.hasOwnProperty("calificacion3") &&(
        <Box
          width={["100%", "80%", "50%"]}
          margin="0 auto"
          padding="2rem"
          boxShadow="lg"
          borderRadius="lg"
          backgroundColor="gray.100"
        >
          {/* Título del quiz */}
          <Text fontSize="3xl" fontWeight="bold" mb="2rem">
            ¿Qué calificacion le darias a esta casa?
          </Text>

          {/* Pregunta */}
          <Box>
            <Flex>
              <Property property={highProperty} key={ejemploPropiedad.id}/>
            </Flex>
            <Text fontWeight="bold" mb="1rem">
              Calificación:
            </Text>
            <Slider
              aria-label="slider-ex-1"
              defaultValue={3}
              min={1}
              max={5}
              step={1}
              onChange={handleSliderChange3}
              colorScheme="blue"
              trackBorderColor="gray.200"
              trackBorderWidth="1px"
              trackHeight="8px"
              thumbBoxSize={7}
              thumbBorderColor="blue.500"
              thumbColor="white"
              thumbShadow="lg"
              thumbTransform="translate(-50%, -50%)"
              _focusThumb={{
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
              }}
              _activeThumb={{
                boxShadow: "none",
              }}
            >
              <SliderTrack bg="gray.200">
                <SliderFilledTrack bg="blue.500" />
              </SliderTrack>
              <SliderThumb boxSize={7}>
                <Box color="blue.500" as={MdStar} />
              </SliderThumb>
            </Slider>
            <Text fontWeight="bold" mt="1rem">
              {calificacion3}
            </Text>
          </Box>
          {/* Botón para enviar el quiz */}
          <Button
            colorScheme="blue"
            size="lg"
            mt="2rem"
            onClick={() => enviar3(calificacion3)}
          >
            Enviar
          </Button>
        </Box>
      )}

      {datos.hasOwnProperty("calificacion3") && (
        <Button
          colorScheme="green"
          size="lg"
          mt="2rem"
          onClick={sendForm}
          >
          Enviar
        </Button>
      )}

      
    </ChakraProvider>
  );
}

export async function getServerSideProps() {
  var docRef = doc(db, "dumbProperties", "TRtvHelF3c8w5pt02tJC");
  var docSnap = await getDoc(docRef);
  const lowProperty = docSnap.data()

  docRef = doc(db, "dumbProperties", "e1U43sfNSaFlvlbBcaYM");
  docSnap = await getDoc(docRef);
  const mediumProperty = docSnap.data()

  docRef = doc(db, "dumbProperties", "YfeAjq2EuIYmFTq69snd");
  docSnap = await getDoc(docRef);
  const highProperty = docSnap.data()

  console.log(highProperty)
  return {
    props: {
      lowProperty: lowProperty,
      mediumProperty: mediumProperty,
      highProperty: highProperty
    },
  };
}