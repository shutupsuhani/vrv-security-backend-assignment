// index.js

const express =require('express');
const mongoose =require('mongoose');
const dotenv =require('dotenv');
const authRoutes =require('./routes/authRoutes.js');
const profileRoutes=require('./routes/profileRoutes.js');
const adminRoutes=require('./routes/adminRoutes.js')
dotenv.config(); 

const app = express();
app.use(express.json());
//app.use(express.static('public'));

// Connect to MongoDB
mongoose
  .connect(process.env.URL
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

 app.use('/auth',authRoutes) 
 app.use('/profile',profileRoutes)
 app.use('/admin',adminRoutes)
// Set the port
const port = process.env.PORT || 3000; 

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
