const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
// import { MongoClient } from "mongodb";
const ObjectId = require('mongodb').ObjectId;

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

const uri = "mongodb+srv://silkSaree:bf6bYOciDyyaPQBv@clustersaree.fhpfv.mongodb.net/silkSaree?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
	try {
		await client.connect();
		/* const database = client.db("insertDB");
		const haiku = database.collection("haiku"); */
		// replace above  two lines by this code 
		const userCollection = client.db("silkSaree").collection("user");
		// create a document to insert
		/* const doc = {
		  title: "Record of a Shriveled Datum",
		  content: "No bytes, no problem. Just insert a document, in MongoDB",
		} */
		// get the users
		app.get('/user', async (req, res) => {
			const query = {};
			const cursor = userCollection.find(query);
			const users = await cursor.toArray();
			res.send(users);
		});
		// for updating route 
		app.get('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        });

		// send data to the server 
		app.post('/user', async (req, res) => {
			const newUser = req.body;
			console.log('adding a new user', newUser);
			const result = await userCollection.insertOne(newUser);
			res.send(result);

		})
		
		// update the user data 
		app.put('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

		// Delete a user by this method 
		app.delete('/user/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await userCollection.deleteOne(query);
			res.send(result);
		})









		/* const user = { name: 'def', email: 'def@gmail.com' }
		const result = await userCollection.insertOne(user);
		console.log(`A document was inserted with the _id: ${result.insertedId}`); */
	}
	finally {
		/* 	await client.close(); */
	}
}
run().catch(console.dir);











/* client.connect(err => {
	const collection = client.db("silkSaree").collection("users");
	console.log('db connected ');
  // perform actions on the collection object
  client.close();
}); */

app.listen(port, () => {
	console.log('server is runing');
})