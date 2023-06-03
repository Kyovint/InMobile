import React, { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, Input, Textarea, Button, SimpleGrid, Card, Checkbox, Select, Image as ChakraImage } from "@chakra-ui/react";
import {v4} from 'uuid'

import { uploadFile , uploadProperty} from '../../utils/firebase';
import {db} from "../../utils/firebase"
import { collection, query, where, getDocs } from "firebase/firestore";

import {auth} from "../../utils/firebase"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useRouter} from 'next/router'
import {fetchApi } from '../../utils/fetchApi';

export default function Editar({idActualProperty, propertyDetails: { price, floors, managementPrice, city, rooms, title, baths, area, stratum, description, type, garage, neighborhood, furnished, address, photos, antiquity, elevator}, owner: {id, photoURL} }) {
  const [titulo, setTitulo] = useState(title);
  const [descripcion, setDescripcion] = useState(description);
  const [precio, setPrecio] = useState(price);
  const [direccion, setDireccion] = useState(address);
  const [antiguedad, setAntiguedad] = useState(antiquity);
  const [areax, setAreax] = useState(area);
  const [ciudad, setCiudad] = useState(city);
  const [tieneAscensor, setTieneAscensor] = useState(elevator);
  const [piso, setPiso] = useState(floors);
  const [amoblado, setAmoblado] = useState(furnished);
  const [garaje, setGaraje] = useState(garage);
  const [precioAdmin, setPrecioAdmin] = useState(managementPrice);
  const [barrio, setBarrio] = useState(neighborhood);
  const [numHabitaciones, setNumHabitaciones] = useState(rooms);
  const [estrato, setEstrato] = useState(stratum);
  const [numBanos, setNumBanos] = useState(baths);
  const [tipo, setTipo] = useState('Apartamento');

  const [user, loading] = useAuthState(auth)
  const router = useRouter();

  if(!user){
    router.push('/')
  }

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
    console.log(idActualProperty)
    e.preventDefault();
    
    try {
        const properyObj = 
        {
            address: direccion,
            antiquity: antiguedad,
            area: areax,
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
            photos: photos
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
          idProperty: idActualProperty,
          littleSize: false,
          lowClass: false,
          mediumClass: false,
          mediumSize: false,
          reachable: false
        }
        asignCategorical(properyObj, categoricalObj)

        await uploadProperty(properyObj, categoricalObj, idActualProperty)
        router.push(`/property/${idActualProperty}`)
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

  return (
    <Box maxW="md" mx="auto" mt="8">
        Editando propiedad...
      <Card p="8">
        <form onSubmit={handleSubmit}>
            <FormLabel mt="4">Tipo de inmueble</FormLabel>
            <Select value={tipo} onChange={(event) => setTipo(event.target.value)}>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
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
            <Input type="number" value={areax} onChange={(event) => setAreax(event.target.value)} />

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

            <Button mt="8" colorScheme="blue" type="submit" >
                Publicar
            </Button>
        </form>
      </Card>
    </Box>
  );
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

    return {
        props: {
        propertyDetails: data,
        owner: selectedUser[0],
        idActualProperty: id
        },
    };
}