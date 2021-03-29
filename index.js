const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json())
app.use(cors());

const port = 5000;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykirh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("EmaJohn").collection("products");
  const ordersCollection = client.db("EmaJohn").collection("orders");

  app.get('/', (req, res) => {
    req.send('Database is working!');
  })
  
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount);
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, document) => {
      res.send(document[0]);
    })
  })

  app.post('/cartProducts', (req, res) => {
    const productKeys = req.body;

    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

});


app.listen(process.env.PORT || port);