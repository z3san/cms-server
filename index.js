require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

//Middleware
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vzimcou.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    const cmsCollection = client.db("cmsCollection").collection("cmsInfo");

    app.get("/", (req, res) => {
      res.send("CMS server is running");
    });

    //get all users
    app.get("/users", async (req, res) => {
      const result = await cmsCollection.find().toArray();
      res.send(result);
    });

    //Post a user api
    app.post("/create-user", async (req, res) => {
      const userData = req.body;
      const result = await cmsCollection.insertOne(userData);
      res.send(result);
    });

    // Update a user by ID
app.put("/update-user/:id", async (req, res) => {
  const id = req.params.id;
  const updatedUserData = req.body;
  try {
    const query = { _id: new ObjectId(id) };
    const updateOperation = { $set: updatedUserData };
    const result = await cmsCollection.updateOne(query, updateOperation);
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
});



    //delete user api
    app.delete("/delete-user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cmsCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`CMS is running on port ${port} `);
});
