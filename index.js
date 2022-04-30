const express = require('express');
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 5000;

// user name : silkSaree
// password : bf6bYOciDyyaPQBv

// use middleware 
app.use(cors());
app.get('/', (req, res) => {
	res.send('Running My Node Server');
});


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://silkSaree:bf6bYOciDyyaPQBv@clustersaree.fhpfv.mongodb.net/silkSaree?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
	const collection = client.db("test").collection("devices");
	console.log('db connected ');
  // perform actions on the collection object
  client.close();
});

app.listen(port, () => {
	console.log('server is runing');
})