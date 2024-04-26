// server.js
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Hospital = require('./models/Hospital');



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require('dotenv').config()
app.use('/uploads', express.static(path.join(__dirname, '../client/public/')));


// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Destination directory for file uploads
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    cb(null, file.originalname);
  }
});

// Initialize multer middleware
const upload = multer({ storage: storage });



// POST route for handling file uploads
app.post('/api/hospitals/register', upload.single('registrationCertificate'),(req,res) =>{
        //  console.log(req.data);
        const hospital = new Hospital({
            hospitalName:req.body.hospitalName,
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            pincode:req.body.pincode,
            registrationDate:req.body.registrationDate,
            ambulancesAvailable:req.body.ambulancesAvailable,
            email:req.body.email,
            phone:req.body.phone,
            registrationNumber:req.body.registrationNumber,
            emergencyWardNumber:req.body.emergencyWardNumber,
            registrationCertificate: req.file.originalname,
            password:req.body.password
        });
    
    // Save the hospital to the database
     hospital.save().then(()=>res.status(200).json("saved")).catch((err)=>res.status(400).json(`error:${err}`));

    // Send success response
});
const upload2 = multer({
    dest:'../client/public/uploads/',
  });
app.post('/api/hospitals/upload', upload2.single('image'), (req, res) => {
    console.log(req.body.image);
    const file =req.body.image;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    // Process the uploaded file, such as saving it to the server or database
    console.log('Image uploaded:', file.originalname);
    res.status(200).send('Image uploaded successfully.');
  });
  app.post('/api/hospitals/login' ,async (req, res) => {
    
        const { email, password } = req.body;
        const user = await Hospital.findOne({ email });
        // console.log(user);
        if (user) {
          const isSame = await bcrypt.compare(password, user.password);
    
          if (isSame) {
            // Generate the JWT token using the createJWT method from the user instance
            const token = await user.createJWT();
            console.log(token);
            const userData = {
              username: user.username,
              email: user.email,
              // Add other user data fields as needed
            };
            // Send the token and user data back to the client
            return res.status(200).json({ user:userData, token });
          } else {
            return res.status(401).send("Authentication failed: Incorrect password");
          }
        } else {
          return res.status(401).send("Authentication failed: User not found");
        }
      
  });
// Route to fetch all hospital data
app.get('/api/hospitals/data', async (req, res) => {
    try {
      // Fetch all hospitals from the database
      const hospitals = await Hospital.find();
      res.json(hospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.put('/api/hospitals/:hospitalId/status', async (req, res) => {
    const { hospitalId } = req.params;
  const { status } = req.body;

  try {
    // Find the hospital by ID
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    // Update the status of the hospital
    hospital.status = status;
    await hospital.save();

    res.json({ message: 'Hospital status updated successfully', hospital });
  } catch (error) {
    console.error('Error updating hospital status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  });


  
  // Connect to MongoDB
mongoose.connect('mongodb+srv://panghalunique:rm63JOwd7Wtyw31Z@cluster0.duzryck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server once connected to MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

// server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const Hospital = require('./models/Hospital');
// const hospitalController = require('./controllers/hospitalController');
// const uploadController = require('./controllers/uploadController');

// const hospitalRoutes = require('./routes/hospitalRoutes');


// const app = express();
// const PORT = process.env.PORT || 5000;
// require('dotenv').config()

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // Define storage for uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../client/public/uploads/'); // Destination directory for file uploads
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique filename for the uploaded file
//     cb(null, file.originalname);
//   }
// });

// // Initialize multer middleware
// const upload = multer({ storage: storage });
// app.use('/api/hospitals', hospitalRoutes);
// // Routes
// // POST route for handling hospital registration
// app.post('/register', upload.single('registrationCertificate'), hospitalController.registerHospital);

// // POST route for handling image uploads
// app.post('/upload', upload.single('image'), uploadController.uploadImage);

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://panghalunique:rm63JOwd7Wtyw31Z@cluster0.duzryck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
//     // Start the server once connected to MongoDB
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Failed to connect to MongoDB:', error);
//   });
