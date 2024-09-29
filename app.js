const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS middleware

const app = express();
app.use(express.json()); // Parse JSON request bodies

// Enable CORS for all routes and origins
app.use(cors());

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://bocchi_277:%40why_are_you_gay@cluster0.xtv5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Medicine schema and model
const MedicineSchema = new mongoose.Schema({
  SrNo: Number,
  DrugName: String,
  Strength: String,
  Indication: String,
  DateOfApproval: String,
});

const Medicine = mongoose.model('Medicine', MedicineSchema);

// Search API route
app.get('/api/search', async (req, res) => {
  const medicineName = req.query.name;
  try {
    const result = await Medicine.findOne({ DrugName: new RegExp(`^${medicineName}$`, 'i') });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    console.error('Error in /api/search:', error); // Log the error for more info
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
