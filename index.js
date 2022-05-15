const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// user name : silkSaree
// password : bf6bYOciDyyaPQBv

// use middleware 
app.use(cors());
app.use(express.json());

// jwt function 
function verifyJwt(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).send({ message: 'unauthorized access' });
	}
	const token = authHeader.split(' ')[1];
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
		if (error) {
			return res.status(403).send({ message: 'Forbidden access' });
		}

		req.decoded = decoded;
		next();
	})


}

app.get('/', (req, res) => {
	res.send('Running My Node Server');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustersaree.fhpfv.mongodb.net/silkSaree?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
	try {
		await client.connect();
		const userCollection = client.db("silkSaree").collection("user");
		const orderCollection = client.db('silkSaree').collection('order');

		// post token 
		app.post('/login', async (req, res) => {
			const user = req.body;
			const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
				expiresIn: '1d'
			})
			res.send({ accessToken });
		})
		// get the inventory only 6

		app.get('/inventory', async (req, res) => {
			const query = {};
			const cursor = userCollection.find(query);
			const fruits = await cursor.limit(6).toArray();
			res.send(fruits);
		});
		// get the all inventory 
		app.get('/allinventory', async (req, res) => {
			const query = {};
			const cursor = userCollection.find(query);
			const allFruits = await cursor.toArray();
			res.send(allFruits);
		});

		app.get('/orders', verifyJwt, async (req, res) => {
			const decodedEmail = req.decoded.email;
			const email = req.query.email;
			if (email === decodedEmail) {
				const query = { email: email };
				const cursor = orderCollection.find(query);
				const orders = await cursor.toArray();
				res.send(orders);
			}
			else {
				res.status(403).send({ message: 'Forbidden access' });
			}

		})
		// for updating route 
		app.get('/allinventory/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await userCollection.findOne(query);
			res.send(result);
		});

		// send data to the server 
		app.post('/allinventory', async (req, res) => {
			const newFruit = req.body;
			const result = await userCollection.insertOne(newFruit);
			res.send(result);

		})

		// order post 
		app.post('/order', async (req, res) => {
			const order = req.body;
			const result = await orderCollection.insertOne(order);
			res.send(result);
		})



		// update the user data 
		app.put('/allinventory/:InventoryId', async (req, res) => {
			const id = req.params.InventoryId;
			const updatedUser = req.body;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updatedDoc = {
				$set: {
					quantity: updatedUser.quantity
					// email: updatedUser.email
				}
			};
			const result = await userCollection.updateOne(filter, updatedDoc, options);
			res.send(result);

		})

		// Delete a user by this method 
		app.delete('/orders/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const deletOrders = await orderCollection.deleteOne(query);
			res.send(deletOrders);
		})

		app.delete('/allinventory/:id', async (req, res) => {
			const id = req.params.id;
			const query = {_id: ObjectId(id)};
			const result = await userCollection.deleteOne(query);
			res.send(result);
		})










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