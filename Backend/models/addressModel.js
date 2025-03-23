const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  stateDistrict: { 
    type: String 
  },
  county: { 
    type: String 
  },
  postcode: { 
    type: String 
  },
  road: { 
    type: String 
  },
  country: { 
    type: String, 
    required: true 
  },
  countryCode: { 
    type: String, 
  },
  isoCode: { 
    type: String 
  }
}, {
  timestamps: true
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
