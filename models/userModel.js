const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'washer', 'admin'], required: true },
  phone: { type: Number, unique: true },
  address: {
    type: String,
  },
  accounttype: {
    type: String,
    required: true,
    default: 'active'
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  washerDetails: {
    jobsCompleted: { type: Number, default: 0 },
    overallRating: { type: Number, default: 0 },
    comment: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
    status: { type: Boolean, default: true },
  },

  ownerDetails: {
    jobsGiven: { type: Number, default: 0 },
    recentRating: {
      rating: { type: Number },
      comment: { type: String },
      givenTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
    },
  },
  coupons: {
    minisuv: { type: Number, default: 0 },
    suv: { type: Number, default: 0 },
    hatchback: { type: Number, default: 0 },
    sedan: { type: Number, default: 0 },
  }

});

module.exports = mongoose.model('User', userSchema);
