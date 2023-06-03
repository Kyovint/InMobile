import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, deleteDoc} from "firebase/firestore"; 

import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {v4} from 'uuid'

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCA11QcB2vlW9I1AW5s79iW-h3dYgxs6p8",
  authDomain: "inmobile-84e1a.firebaseapp.com",
  databaseURL: "https://inmobile-84e1a-default-rtdb.firebaseio.com/",
  projectId: "inmobile-84e1a",
  storageBucket: "inmobile-84e1a.appspot.com",
  messagingSenderId: "1072420474657",
  appId: "1:1072420474657:web:c031e0b50bdc1b5f22b860"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

//Metodo para subir imagenes a firebase storage
export async function uploadFile(file,id){
    const storageRef = ref(storage, `properties/${id}/${v4()}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url
}

//funcion para subir propiedad
export async function uploadProperty(property,categorical, id){
    try {
        const docPropertyRef = await setDoc(doc(db, "properties", id), property);
        console.log(docPropertyRef);
        const docCategoricalRef = await setDoc(doc(db, "categorical", id), categorical);
        console.log(docCategoricalRef);
        alert("Propiedad cargada correctamente")
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

//Funcion para registrar a una persona dentro de firestore
export async function uploadUserInformation(user, id){
  try {
      const docRef = await setDoc(doc(db, "users", id), user);
    } catch (e) {
      console.error("Error adding user: ", e);
    }
}

//Funcion para registrar a una persona dentro de firestore
export async function deleteProperty(id){
  try {
    await deleteDoc(doc(db, "properties", id))
    await deleteDoc(doc(db, "categorical", id))
    } catch (e) {
      console.error("Error deleting property: ", e);
    }
}