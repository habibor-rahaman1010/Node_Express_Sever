const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');

//This is my middlewares here...
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

//my mongodb connection here
const myMongoDB = async () => {
    const uri = "mongodb+srv://habibor144369:pGXoBkThFzbCSrLY@cluster0.sefj3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect((err) => {
            if (err) {
                console.log('Went something wrong')
            }
            else {
                const database = client.db('Blogger');
                const collection = database.collection('All_Blog')

                //here is my all post get PAI...
                app.get('/all/blogs', async (req, res, next) => {
                    const cursor = collection.find({});
                    const blogs = await cursor.toArray();
                    res.send(blogs);
                });

                //This is my blogs post API...
                app.post('/post/blogs', async (req, res, next) => {
                    const newBlogs = req.body;
                    const result = await collection.insertOne(newBlogs);
                    res.json(result);
                })

                //this is my perticuler blogs details API....
                app.get('/blogs/details/:id', async (req, res, next) => {
                    const id = req.params.id;
                    const query = { _id: ObjectId(id) };
                    const blog = await collection.findOne(query);
                    res.send(blog);
                });

                //This is my blogs delete API
                app.delete('/delete/blogs/:id', async (req, res, next) => {
                    const id = req.params.id;
                    const query = { _id: ObjectId(id) };
                    const result = await collection.deleteOne(query);
                    res.json(result)
                })

                //this is my update PAI
                app.put('/blogs/details/update/:id', async (req, res, next) => {
                    const id = req.params.id;
                    const updateBlogs = req.body;
                    console.log(updateBlogs)
                    const query = { _id: ObjectId(id) };
                    const options = { upsert: true };
                    const updateDoc = {
                        $set: {
                            title: updateBlogs.title,
                            category: updateBlogs.category,
                            author: updateBlogs.author,
                            description: updateBlogs.description
                        }
                    }
                    const result = await collection.updateOne(query, updateDoc, options);
                    res.json(result)
                })


                console.log('connectin the db...')
            }
        });
    }
    catch (error) {
        console.log('Went somrthing wrong')
    }
    finally {
        await client.close();
    }
}

myMongoDB().catch((error) => {
    console.log(error)
})


app.listen(port, () => {
    console.log(`My Node Express Server listening on port ${port}`)
})