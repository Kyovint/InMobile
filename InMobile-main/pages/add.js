import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, Input, Textarea, Button, SimpleGrid, Card, Checkbox, Select, Image as ChakraImage } from "@chakra-ui/react";
import {v4} from 'uuid'

import { uploadFile , uploadProperty} from '../utils/firebase';
import {db} from "../utils/firebase"
import { collection, query, where, getDocs } from "firebase/firestore";

import {auth} from "../utils/firebase"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useRouter} from 'next/router'

export default function Publicar() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [direccion, setDireccion] = useState('');
  const [antiguedad, setAntiguedad] = useState('');
  const [area, setArea] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [tieneAscensor, setTieneAscensor] = useState(false);
  const [piso, setPiso] = useState('');
  const [amoblado, setAmoblado] = useState(false);
  const [garaje, setGaraje] = useState(false);
  const [precioAdmin, setPrecioAdmin] = useState('');
  const [barrio, setBarrio] = useState('');
  const [numHabitaciones, setNumHabitaciones] = useState('');
  const [estrato, setEstrato] = useState('');
  const [numBanos, setNumBanos] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [tipo, setTipo] = useState('Casa');

  const [user, loading] = useAuthState(auth)
  const router = useRouter();

  if(!user){
    router.push('/')
  }

  useEffect(() =>{
    setSelectedPhotos(selectedPhotos);
  }, [selectedPhotos])

  useEffect(() =>{
    const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
    getDocs(userQuery).then((snapshot) => {
      const actualUser = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log()
      if(actualUser[0].phoneNumber == null){
        alert("Debes registrar un numero celular en tu perfil para subir una propiedad")
        router.push('/user')
      }
    });
    
  }, [user.phoneNumber, router,user.uid])
  

  const handleSubmit = async(e) => {
    e.preventDefault();
    const idPost = v4();
    
    try {
        const photos = Array.from(selectedPhotos)
        const promises = photos.map((photo) => uploadFile(photo, idPost));
        const updatedURLs = await Promise.all(promises);
        const properyObj = 
        {
            address: direccion,
            antiquity: antiguedad,
            area: area,
            city: ciudad,
            country: "Colombia",
            description: descripcion,
            elevator: tieneAscensor,
            floors: piso,
            furnished: amoblado,
            garage: garaje,
            userId: user.uid,
            managementPrice: precioAdmin,
            neighborhood: barrio,
            price: precio,
            rooms: numHabitaciones,
            stratum: estrato,
            title: titulo,
            type: tipo,
            baths: numBanos,
            photos: updatedURLs
        }
        var categoricalObj={
          apartment: false,
          bigSize: false,
          cheap: false,
          elevatorNecessary: false,
          expensive: false,
          furnished: false,
          garage: false,
          highClass: false,
          house: false,
          idProperty: idPost,
          littleSize: false,
          lowClass: false,
          mediumClass: false,
          mediumSize: false,
          reachable: false
        }
        asignCategorical(properyObj, categoricalObj)

        await uploadProperty(properyObj, categoricalObj, idPost)
        router.push(`/property/${idPost}`)
    } catch (error) {
        console.log(error)
    }
  };

  const asignCategorical = (property, categorical) =>{
    categorical.apartment = property.type == "apartment" ? true : false
    categorical.house = !categorical.apartment
    categorical.elevatorNecessary = property.elevator == true ? true : false
    categorical.garage = property.garage == true ? true : false
    categorical.furnished = property.furnished == true ? true : false


    if(property.price >= 450000000){
      categorical.expensive = true
    }else if (property.price > 150000000 && property.price < 450000000){
      categorical.reachable = true
    }else{
      categorical.cheap = true
    }

    if(property.stratum <= 2){
      categorical.lowClass = true
    }else if(property.stratum > 4){
      categorical.highClass = true
    }else{
      categorical.mediumClass = true
    }

    if(property.area > 85){
      categorical.bigSize = true
    }else if(property.area < 50){
      categorical.littleSize = true
    }else{
      categorical.mediumSize = true
    }

  }

  const handleImagenes = (event) => {
    const files = event.target.files;
    const urls = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      urls.push(url);
    }
  
    setImagenes(urls);

    setSelectedPhotos(event.target.files);
  };



  return (
    <Box maxW="md" mx="auto" mt="8">
        AQUI CREARAS EL FUTURO HOGAR DE UNA PERSONA
      <Card p="8">
        <form onSubmit={handleSubmit}>
            <FormLabel mt="4">Tipo de inmueble</FormLabel>
            <Select value={tipo} onChange={(event) => setTipo(event.target.value)}>
                <option value="casa">casa</option>
                <option value="apartamento">apartamento</option>
            </Select>

            <FormLabel>Título</FormLabel>
            <Input type="text" value={titulo} onChange={(event) => setTitulo(event.target.value)} />

            <FormLabel mt="4">Descripción</FormLabel>
            <Textarea value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />

            <FormLabel mt="4">Precio</FormLabel>
            <Input type="number" value={precio} onChange={(event) => setPrecio(event.target.value)} />

            <FormLabel mt="4">Dirección</FormLabel>
            <Input type="text" value={direccion} onChange={(event) => setDireccion(event.target.value)} />

            <FormLabel mt="4">Antigüedad</FormLabel>
            <Input type="number" value={antiguedad} onChange={(event) => setAntiguedad(event.target.value)} />

            <FormLabel mt="4">Área</FormLabel>
            <Input type="number" value={area} onChange={(event) => setArea(event.target.value)} />

            <FormLabel mt="4">Ciudad</FormLabel>
            <Input type="text" value={ciudad} onChange={(event) => setCiudad(event.target.value)} />

            <FormLabel mt="4">Tiene ascensor</FormLabel>
            <Checkbox isChecked={tieneAscensor} onChange={(event) => setTieneAscensor(event.target.checked)}>
                Sí
            </Checkbox>

            <FormLabel mt="4">¿Cuantos pisos tiene?</FormLabel>
            <Input type="number" value={piso} onChange={(event) => setPiso(event.target.value)} />

            <FormLabel mt="4">¿Está amoblado?</FormLabel>
            <Checkbox isChecked={amoblado} onChange={(event) => setAmoblado(event.target.checked)}>
                Sí
            </Checkbox>

            <FormLabel mt="4">¿Tiene garaje?</FormLabel>
            <Checkbox isChecked={garaje} onChange={(event) => setGaraje(event.target.checked)}>
                Sí
            </Checkbox>

            <FormLabel mt="4">Precio de administración</FormLabel>
            <Input type="number" value={precioAdmin} onChange={(event) => setPrecioAdmin(event.target.value)} />

            <FormLabel mt="4">Barrio</FormLabel>
            <Input type="text" value={barrio} onChange={(event) => setBarrio(event.target.value)} />

            <FormLabel mt="4">Número de habitaciones</FormLabel>
            <Input type="number" value={numHabitaciones} onChange={(event) => setNumHabitaciones(event.target.value)} />

            <FormLabel mt="4">Estrato</FormLabel>
            <Select value={estrato} onChange={(event) => setEstrato(event.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
            </Select>

            <FormLabel mt="4">Número de baños</FormLabel>
            <Input type="number" value={numBanos} onChange={(event) => setNumBanos(event.target.value)} />

            <FormLabel mt="4">Imágenes</FormLabel>
            <FormLabel mt="4">No podrás modificar tus imagenes mas adelante, seleccionalas con cuidado</FormLabel>
                <Input type="file" id="imagenes" multiple onChange={handleImagenes} />
                
                {imagenes.length > 0 && (
                <SimpleGrid columns={3} spacing={2} mt="4">
                    {imagenes.map((imagen) => (
                        <Box key={imagen} w="100%" h="150px" bg="gray.100" borderRadius="md">
                            <ChakraImage src={imagen} w="100%" h="100%" objectFit="cover" borderRadius="md" />
                        </Box>
                    ))}
                </SimpleGrid>
                )}
            <Button mt="8" colorScheme="blue" type="submit" >
                Publicar
            </Button>
        </form>
      </Card>
    </Box>
  );
}