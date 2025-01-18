import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-system');

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  clientName: String,
  date: Date,
  amount: Number,
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending'],
    default: 'Pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req .body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).send({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(400).send({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.send({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(401).send({ error: 'Invalid login credentials' });
  }
});

// Invoice routes
app.get('/api/invoices', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id });
    res.send(invoices);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching invoices' });
  }
});

app.post('/api/invoices', auth, async (req, res) => {
  try {
    const invoice = new Invoice({
      ...req.body,
      userId: req.user._id,
    });
    await invoice.save();
    res.status(201).send(invoice);
  } catch (error) {
    res.status(400).send({ error: 'Error creating invoice' });
  }
});

app.put('/api/invoices/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!invoice) {
      return res.status(404).send();
    }
    
    res.send(invoice);
  } catch (error) {
    res.status(400).send({ error: 'Error updating invoice' });
  }
});

app.delete('/api/invoices/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    
    if (!invoice) {
      return res.status(404).send();
    }
    
    res.send(invoice);
  } catch (error) {
    res.status(500).send({ error: 'Error deleting invoice' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});