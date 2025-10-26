// const express = require('express');
// const app = express();
// const PORT = 3000;

// app.get('/', (req, res) => {
//     res.send("What's up people?")
// })

// app.use(express.static('./public'))


// app.get('/api/projects', (req,res) => {
//     res.json('./projects')
// })

// app.listen(PORT, ()=> {
//     console.log(`Server running at http//localhost:${PORT}`)
// })

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const express = require('express');
// const fs = require('fs');
// const { console } = require('inspector');
// const path = require('path');
// const app = express();
// const PORT = 3000;

// // Serve static frontend files
// app.use(express.static('public'));

// // API route to serve projects.json
// app.get('/api/projects', (req, res) => {
//   const filePath = path.join(__dirname, 'public', 'projects.json');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading projects.json:', err);
//       res.status(500).json({ error: 'Failed to load projects' });
//     } else {
//       try {
//         const projects = JSON.parse(data);
//         res.json(projects);
        
//       } catch (parseErr) {
//         console.error('Error parsing JSON:', parseErr);
//         res.status(500).json({ error: 'Invalid JSON format' });
//       }
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const express = require('express');
const app = express();
//const PORT = 3000;

const mongoose = require('mongoose');

require('dotenv').config({ path: './mydot.env' });
const PORT = process.env.PORT || 3000; //use value in .env or 3000


//-----------cloud-hosted MongoDB Atlas connection using .env variable:----------
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

const JWT_SECRET = process.env.JWT_SECRET;


//---------using local MongoDB connection---------
mongoose.connect('mongodb://localhost:27017/portfolio', {
 useNewUrlParser: true,
 useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));


app.use(express.json())


const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

app.use(express.static('public'));
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);


console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGODB_URI:', process.env.MONGODB_URI);



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

