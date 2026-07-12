const mongoose = require('mongoose');

const JAIPUR_LOCALITIES = [
  'Adarsh Nagar',
  'Ajmer Road',
  'Amer',
  'Bani Park',
  'C-Scheme',
  'Civil Lines',
  'Durgapura',
  'Gopalpura',
  'Jagatpura',
  'Jhotwara',
  'JLN Marg',
  'Malviya Nagar',
  'Mansarovar',
  'MI Road',
  'Nirman Nagar',
  'Pratap Nagar',
  'Raja Park',
  'Sanganer',
  'Shastri Nagar',
  'Sirsi Road',
  'Sitapura',
  'Sodala',
  'Tonk Road',
  'Vaishali Nagar',
  'Vidhyadhar Nagar',
];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roomNo: String,
  college: String,
  locality: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
