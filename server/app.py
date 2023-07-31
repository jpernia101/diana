import os
from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import bcrypt

app = Flask(__name__)
CORS(app)
private_key = os.getenv("DB_TOKEN")
uri = "mongodb+srv://admin:{}@cluster0.xftovyq.mongodb.net/?retryWrites=true&w=majority".format(private_key)

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.get_database('submitForm')
collection = db['user']
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@app.route('/submitForm', methods=['POST'])
def submit_form():
    data = request.json
    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())
    email_exist = collection.find_one({"email": data["email"]})

    if email_exist:
        return jsonify({"message": "Email Already exist", "success": False}), 400    
    
    try:
        data['password'] = hashed_password.decode('utf-8')

        result = collection.insert_one(data)
        print(data)
        print(result.inserted_id)
        return jsonify({"message": "Form Submitted Succesfully","success": True})
    except Exception as e:
        return jsonify({"message": "Failed to store form data"}), 500   
    

@app.route('/updateForm', methods=['POST'])
def update_form():
    data = request.json
    
    print(data)
    user = collection.find_one({"email": data["oldEmail"]})

    new_user = collection.find_one({"email": data["email"]})

    if not user:
        return jsonify({"message": "Email not found", "success": False}), 404
    
    if  new_user:
        return jsonify({"message": "New Email in use already", "success": False}), 400

    
    hashed_password = user['password'].encode('utf-8')

    if not bcrypt.checkpw(data['oldPassword'].encode('utf-8'), hashed_password):
        return jsonify({"message": "Invalid Old Password", "success" : False}), 401

    
    
    print("HERE 2")

    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())
    try:
        data['password'] = hashed_password.decode('utf-8')
        collection.update_one({'email': data['oldEmail']}, {'$set' : {"email": data['email'], "dob": data['dob'], "age": data['age'], "password": data['password'] }})
        return jsonify({"message": "Form Data Updated Succesfully", "success": True})
    except Exception as e:
        return jsonify({"message": "Failed to store form data"}), 500 


@app.route('/verifyUser', methods=['POST'])
def verify_user():
    data = request.json
    user = collection.find_one({"email": data["email"]})

    if not user:
        return jsonify({"message": "Email not found", "success": False}), 404
    
    hashed_password = user['password'].encode('utf-8')

    if not bcrypt.checkpw(data['password'].encode('utf-8'), hashed_password):
        return jsonify({"message": "Invalid Password", "success" : False}), 401
        
    result = {
        'user_id': str(ObjectId()),
        'verified': True
    }
    print(user)
    return jsonify({"message": "Verified","success" : True} ), 200

if __name__ == '__main__':
    app.run(debug=True)