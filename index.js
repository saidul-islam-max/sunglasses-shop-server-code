const express =require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors')
const app = express();
const port =process.env.PORT ||
 5000
//middlewer
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgbtz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)


async function run(){
       try{
           await client.connect();
           const database = client.db('RahamanSunglasseHouse')
           const RahmanProduct = database.collection('Product')
           const RahmanOrder = database.collection('Order')
           const totalReview = database.collection('Review')
           const UserCollection = database.collection('Users')

        //    add product get and post api
           // GET API
          app.get('/product', async (req, res) => {
            const cursor = RahmanProduct.find({});
            const product = await cursor.toArray();
            res.send(product);
          })
           //post api
           app.post('/product',async(req,res) => {
             const product = req.body
             const result = await RahmanProduct.insertOne(product)
              console.log(result)
              res.json(result)
           })

           //    order  get and post api--------------
           //-------------------
           app.get('/order', async (req, res) => {
            const cursor = RahmanOrder.find({});
            const order = await cursor.toArray();
            console.log(order)
            res.json(order);
          })

           app.get('/order', async (req,res) => {
            const email = req.query.email;
            const query ={email:email}
            console.log(query)
            const cursor = RahmanOrder.find(query);
            const findOrder = await cursor.toArray();
            res.json(findOrder)
          })
           
         
          
           //post api
           app.post('/order',async(req,res) => {
             const order = req.body

             const result = await RahmanOrder.insertOne(order)
           
              console.log(result)
              res.json(result)
           })
           //Serch Order
           
           //delet oeder
           app.delete('/order/:id',async(req,res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await RahmanOrder.deleteOne(query);

            console.log('deleting user with id ', result);

            res.json(result);
        })

            //    order  get and post api end


            // Review setion start


            app.get('/review', async (req, res) => {
                const cursor = totalReview.find({});
                const review = await cursor.toArray();
                res.send(review);
              })
               //post api
               app.post('/review',async(req,res) => {
                 const review = req.body
    
                 const result = await totalReview.insertOne(review)
               
                  console.log(result)
                  res.json(result)
               })


               ///user api
               app.get('/users/:email', async (req, res) => {
                const email = req.params.email;
                const query = { email: email };
                const user = await UserCollection.findOne(query);
                let isAdmin = false;
                if (user?.role === 'admin') {
                    isAdmin = true;
                }
                res.json({ admin: isAdmin });
            })
    

               app.post('/users',async(req,res) => {
                const users = req.body
   
                const result = await UserCollection.insertOne(users)
              
                 console.log(result)
                 res.json(result)
              })
              app.put('/users/admin', async (req,res) => {
                const user = req.body;
                console.log('put' ,user)
                const filter = { email: user.email };
                const updateDoc = { $set: { role: 'admin' } };
                const result = await UserCollection.updateOne(filter, updateDoc);
                res.json(result);
              })


       }
       finally{
        //    await client.close()
       }
}
run().catch(console.dir)


app.get('/', (req,res) => {
    res.send('hello Rahman fashio')
})


app.listen(port, () => {
    console.log('Running Rahman fahiondddddd')
})