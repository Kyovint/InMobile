from flask import Flask
from flask import request
import random
import numpy as np
import pandas as pd

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Credenciales de conexion a Firebase
cred = credentials.Certificate('key.json')

#Instancia de la conexion a firebase
app = firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)


@app.route('/inmobile/v1/users', methods=["GET", "POST"])
def getall():
    content = request.get_json(silent=True)

    categoricalRating = pd.DataFrame(columns=['bigSize', 'cheap', 'expensive', 'furnished', 'garage', 'highClass', 'idProperty', 'littleSize', 'mediumSize', 'reachable', 'apartment', 'house', 'mediumClass', 'lowClass', 'elevatorNecessary'])
    categoricalAllPropertiesDF = pd.DataFrame(columns=['bigSize', 'cheap', 'expensive', 'furnished', 'garage', 'highClass', 'idProperty', 'littleSize', 'mediumSize', 'reachable', 'apartment', 'house', 'mediumClass', 'lowClass', 'elevatorNecessary'])
    ratingVector = []
    
    categoricalAllPropertiesDF = getProperties(categoricalAllPropertiesDF)
    categoricalRating = createIdealProperty(categoricalRating,content)
    ratingVector = createRatingVector(ratingVector, content)

    #Matriz de peso
    perfil_usu = categoricalRating.drop(['idProperty'], axis=1).transpose().dot(ratingVector)
    
    generosAll = categoricalAllPropertiesDF.set_index(categoricalAllPropertiesDF['idProperty'])

    generosAll = generosAll.drop('idProperty',axis=1)
    generosAll.shape
    
    #promedio ponderado
    recom = ((generosAll*perfil_usu).sum(axis=1)) / (perfil_usu.sum())
    
    recom = recom.sort_values(ascending=False)
    print(recom.index[1])

    return {"firstRecomendation": recom.index[0],
            "secondRecomendation": recom.index[1],
            "thirdRecomendation": recom.index[2]}


# Methods
def getProperties(emptyCategoricalDF):
    users_ref = db.collection(u'categorical')
    docs = users_ref.stream()

    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')
        nuevaFila = pd.Series(doc.to_dict())
        #emptyCategoricalDF = emptyCategoricalDF.append(nuevaFila, ignore_index=True)
        emptyCategoricalDF.loc[len(emptyCategoricalDF)] = nuevaFila
    
    #Return emptyCategoricalDF filled
    return emptyCategoricalDF*1

def createIdealProperty(categoricalRating, content):

    idealProperty = {'apartment': True,
                    'bigSize': True,
                    'cheap': True, 
                    'expensive': True, 
                    'furnished': False, 
                    'garage': True, 
                    'highClass': True,
                    'mediumClass': True,
                    'lowClass': True,
                    'idProperty': '1', 
                    'littleSize': True, 
                    'mediumSize': True, 
                    'reachable': True,
                    'elevatorNecessary': True,
                    'house': True}
    
    if not content:
        return {"Error": "Empty Json, impossible its read"}, 400
    
    try:
        if content["type"] == "Casa":
            idealProperty["apartment"] = False
        else:
            idealProperty["house"] = False
        
        if content["salary"] == "1 SMLV o menos":
            idealProperty["highClass"] = False
            idealProperty["mediumClass"] = False
            idealProperty["expensive"] = False
            idealProperty["reachable"] = False
        elif content["salary"] == "entre 1 y tres salarios minimos":
            idealProperty["highClass"] = False
            idealProperty["expensive"] = False
        elif content["salary"] == "mas de 3 SMLV":
            idealProperty["lowClass"] = False
        
        if content["peopleNumber"] == "Vivo solo":
            idealProperty["bigSize"] = False
            idealProperty["mediumSize"] = False
        elif content["peopleNumber"] == "1 a 3":
            idealProperty["littleSize"] = False
            idealProperty["bigSize"] = False
        elif content["peopleNumber"] == "4 a 5":
            idealProperty["littleSize"] = False
        elif content["peopleNumber"] == "mas de 5":
            idealProperty["littleSize"] = False
            idealProperty["mediumSize"] = False
        
        if content["disability"] == "No":
            idealProperty["elevatorNecessary"] = False
        
        if content["vehicle"] == "No":
            idealProperty["garage"] = False
        
        if content["occupation"] == "Estudiante" or content["occupation"] == "Desempleado":
            idealProperty["furnished"] = True

    except KeyError as err:
        return {"message":"Invalid Information"}, 422
    
    nuevaFila = pd.Series(idealProperty)
    categoricalRating.loc[len(categoricalRating)] = nuevaFila
    #categoricalRating = categoricalRating.append(idealProperty, ignore_index=True)

    users_ref = db.collection(u'dumbCategorical')
    docs = users_ref.stream()

    for doc in docs:
        #print(f'{doc.id} => {doc.to_dict()}')

        actualFila = pd.Series(doc.to_dict())
        categoricalRating.loc[len(categoricalRating)] = actualFila

        #categoricalRating = categoricalRating.append(doc.to_dict(), ignore_index=True)

    return categoricalRating*1

def createRatingVector(ratingVector, content):
    ratingVector.append(5)
    for key, value in content.items():
        if ('rating' in key):
            ratingVector.append(value)
    
    return ratingVector

app.run(debug=True, port=5001)