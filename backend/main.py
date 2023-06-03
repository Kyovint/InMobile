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


#usage: http://127.0.0.1:5000/inmobile/v1/properties?quantity=2 if you wanna get a specific quantity of elements
#       Only http://127.0.0.1:5000/inmobile/v1/properties to get all elements in Firebase
@app.route('/inmobile/v1/properties', methods=["GET"])
def getProperties():

    quantity = request.args.get('quantity')
    properties_ref = db.collection(u'properties')
    docs = properties_ref.stream()
    properties = []
    for doc in docs:
        actualProperty = doc.to_dict()
        actualProperty["id"] = doc.id
        properties.append(actualProperty)
    
    if quantity != None: properties = properties[-1::-1][0:int(quantity)]

    return properties



@app.route('/inmobile/v1/filterby', methods=["GET"])
def filterProperties():

    args = request.args
    query = db.collection(u'properties')

    for key, value in args.items():
        print(value)
        if key in ['antiquity', 'area', 'floors','rooms','stratum']:
            query = query.where(key,u'==',int(value))
        else:
            if value in ['true','false']:
                query = query.where(key,u'==',bool(value))
            else:
                query = query.where(key,u'==',value)
    
    docs = query.stream()

    properties = []
    for doc in docs:
        actualProperty = {
            'id': doc.id,
            'content': doc.to_dict()
        }
        properties.append(actualProperty)

    return properties

@app.route('/inmobile/v1/properties/details', methods=["GET"])
def getPropertyById():
    id = request.args.get('id')

    doc_ref = db.collection(u'properties').document(id)

    doc = doc_ref.get()
    if doc.exists:
        print(f'Document data: {doc.to_dict()}')
    else:
        print(u'No such document!')

    return doc.to_dict()

app.run(debug=True)