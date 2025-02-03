const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'washer'], required: true },
  phone: { type: Number, unique: true  },
  address: {
    type: String,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  washerDetails: {
    jobsCompleted: { type: Number, default: 0 },
    overallRating: { type: Number, default: 0 },
    comment: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
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


});

module.exports = mongoose.model('User', userSchema);
