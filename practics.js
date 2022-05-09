const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const { ObjectID } = require('bson');
// import { MongoClient } from "mongodb";
// const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// user name : silkSaree
// password : bf6bYOciDyyaPQBv

// use middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Running My Node Server');
});


// password : 3FcQ425CFKVwppmg
// name : fruitStore
/* const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustersaree.fhpfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }); */

async function run() {
	try {
		await client.connect();
		const fruitCollection = client.db("fruitStore").collection("fruits");
		// get the user
		app.get('/fruits', async (req, res) => {
			const query = {};
			const cursor = fruitCollection.find(query);
			const fruits = await cursor.toArray();
			res.send(fruits);
		});
		// for updating route 
		/* app.get('/user/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await userCollection.findOne(query);
			res.send(result);
		}); */

		// send data to the server 
		app.post('/fruit', async (req, res) => {
			const newUser = req.body;
			console.log('adding a new user', newUser);
			const result = await userCollection.insertOne(newUser);
			res.send(result);

		})

		// update the user data 
		/* app.put('/user/:id', async (req, res) => {
			const id = req.params.id;
			const updatedUser = req.body;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updatedDoc = {
				$set: {
					name: updatedUser.name,
					email: updatedUser.email
				}
			};
			const result = await userCollection.updateOne(filter, updatedDoc, options);
			res.send(result);

		}) */

		// Delete a user by this method 
		/* app.delete('/user/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await userCollection.deleteOne(query);
			res.send(result);
		}) */
	}
	finally {
		/* 	await client.close(); */
	}
}
run().catch(console.dir);













app.listen(port, () => {
	console.log('Listening to port ', port);
})
/* const uri = "mongodb+srv://silkSaree:bf6bYOciDyyaPQBv@clustersaree.fhpfv.mongodb.net/silkSaree?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 }); */