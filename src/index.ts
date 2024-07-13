// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

dotenv.config();


const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({extended:true}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/src/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);

  res.sendFile(filepath, (err) => {
    if (err) {
      res.status(404).json({ message: 'File not found' });
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
export * from './middleware/verifyToken';
export * from './controllers/checkSession';

