const express = require('express')
const cors =require('cors')
const xss = require('xss')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000;

//CORS setup: allow requests from frontend
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}))

app.use(bodyParser.json())
app.use(express.static('public'))

//Endpoint to receive and sanitize comments
app.post('/comment',(req, res) => {
    const rawComment = req.body.comment
    const safeComment = xss(rawComment) // Prevent XSS
    res.json({sanitized: rawComment})
})

app.listen(PORT, () => {
    console.log(`Server for cors_xss dey run on http://localhost:${PORT}`)
})