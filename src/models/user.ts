import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {type:String,required:true},
  email: {type:String,required:true,unique:true},
  password: {type:String,required:true},
  age:String,
  scope:String,
 gender:String,
},{ timestamps: true });

const user = mongoose.model('user', userSchema);

export default user;
// Use the User model for CRUD operations
