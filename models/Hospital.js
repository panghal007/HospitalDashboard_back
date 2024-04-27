// models/Hospital.js

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { required } = require('joi');

const hospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  registrationDate: { type: Date, required: true },
  ambulancesAvailable: { type: Number, required: true },
  email: { type: String, required: true , unique },
  phone: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  emergencyWardNumber: { type: String, required: true },
  registrationCertificate: { type: String, required: true }, // File path or URL to the uploaded certificate
  password: { type: String, required: true },
  status:{  type:String}
});

hospitalSchema.pre('save' , async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
  })
  
  
hospitalSchema.methods.createJWT = function (){
      return jwt.sign({userId:this._id,name:this.name},'CmsRJaXBMAahZ_WigGIPdaNsNXF-NCqAEcxZ-RAiHPY',
        {expiresIn: '30d'})
}
  
hospitalSchema.methods.comparePassword = async function(candidatePassword){
      const isMatch = await bcrypt.compare(candidatePassword,this.password)
      return isMatch
}
const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
