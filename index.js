const express = require('express')
const fileSystem = require('fs')
const app = express()


app.use(express.json())


//! read File
const readFile = (callBack) => {
    fileSystem.readFile('data.json', 'utf-8', (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error reading data' });
        }
        callBack(JSON.parse(result));
    })
}

//! write file 
const writeFile = (data, callBack) => {
    fileSystem.writeFile('data.json', JSON.stringify(data), 'utf-8', (err) => {
        if (err) {
            return res.status(500).send({ message: 'Error writing data' });
        } else {
            callBack(err);
        }
    })
}

// get all posts
app.get('/api/post', (req, res) => {
    readFile((data) => {
        res.send({ data: data });
    })
})

// create new post 
app.post('/api/post', (req, res) => {
    readFile((data) => {

        let newId = data.length ? Math.max(...data.map(post => post.id)) + 1 : 1;

        if (!req.body?.title) {
            res.status(400).send({ message: 'the title is required' })
        }
        if (!req.body?.description) {
            res.status(400).send({ message: 'the description is required' })
        }
        if (!req.body?.aouther) {
            res.status(400).send({ message: 'the aouther is required' })
        }

        // Data Form
        let newPost = {
            id: newId,
            title: req.body.title,
            description: req.body.description,
            aouther: req.body.aouther,
            created_at: new Date().toISOString()
        };
        data.push(newPost)
        writeFile(data, () => {
            res.send({ message: 'data added successfully' })
        })
    })
})

// update post 
app.put('/api/post/:id', (req, res) => {
    const id = req.params.id;
    readFile((data) => {
        const index = data.findIndex((item) => item.id == id);

        if (index == -1) {
            res.status(404).send({ message: 'this user does not exist' })
        }

        const updatedPost = {
            ...data[index],
            title: req.body.title || data[index].title,
            description: req.body.description || data[index].description,
            aouther: req.body.aouther || data[index].aouther,
            created_at: data[index].created_at
        };

        data[index] = updatedPost;
        writeFile(data, () => {
            res.send({ message: 'data Edited successfully' })
        })
    })
})

// delete post 
app.delete('/api/post/:id', (req, res) => {
    const id = req.params.id;

    readFile((data) => {
        const index = data.findIndex((item) => item.id == id);
        if (index == -1) {
            res.status(404).send({ message: 'this user does not exist' })
        }

        const newData = data.filter((item) => item.id != id);

        writeFile(newData, () => {
            res.send({ message: 'data Deleted successfully' })
        })
    })
})



const port = 3000;
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`server listening on http://localhost:${port}`);
});
