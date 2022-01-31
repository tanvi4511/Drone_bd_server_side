const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();



const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hecm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('drone_bd');
        const productCollection = database.collection('products');
        const bookingCollection = database.collection('bookings');
        const userCollection = database.collection('user');
        const reviewCollection = database.collection('review');



        app.post('/user', async (req, res) => {
            const newBooking = req.body;
            const result = await userCollection.insertOne(newBooking);
            res.send(result)
        });

        app.put('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query)
            let isAdmin = false;

            if (user.role === "admin") {
                isAdmin = true
            } else {
                isAdmin = false
            }
            res.send({ admin: isAdmin });
        })




        //get Api all products
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.post('/products', async (req, res) => {
            const review = req.body;
            const result = await productCollection.insertOne(review);
            res.send(result)
        })


        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const package = await productCollection.findOne(query)
            res.send(package);
            console.log(id);
        });




        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        });
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        });


        app.post('/purchase', async (req, res) => {
            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking);
            res.send(result)
        })
        app.get('/purchase', async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })


        app.get('/purchase/:uEmail', async (req, res) => {
            const uEmail = req.params.uEmail;
            const query = { email: uEmail }
            const cursor = bookingCollection.find(query);
            const userBookings = await cursor.toArray();
            res.send(userBookings);
        })



        app.put('/user/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);


        })

        app.delete('/products/:id', async (req, res) => {
            const productId = req.params.id;
            const query = { _id: ObjectId(productId) };

            const result = await productCollection.deleteOne(query);
            res.send(result);
        })




        app.delete('/purchase/:ordergId', async (req, res) => {
            const bookingId = req.params.ordergId;
            const query = { _id: ObjectId(bookingId) };

            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })
        // GET bookings API
        // app.get('/bookings', async (req, res) => {
        //     const cursor = bookingCollection.find({});
        //     const bookings = await cursor.toArray();
        //     res.send(bookings);
        // })



        // app.get('/bookings/:uEmail', async (req, res) => {
        //     const uEmail = req.params.uEmail;
        //     const query = { email: uEmail }
        //     const cursor = bookingCollection.find(query);
        //     const userBookings = await cursor.toArray();
        //     res.send(userBookings);
        // })



        // app.delete('/booking/:bookingId', async (req, res) => {
        //     const bookingId = req.params.bookingId;
        //     const query = { _id: ObjectId(bookingId) };

        //     const result = await bookingCollection.deleteOne(query);
        //     res.send(result);
        // })




    } finally {
        // await client.close(); 
    }

}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("running website");
});

app.listen(port, () => {
    console.log("running sob kisu", port);
})