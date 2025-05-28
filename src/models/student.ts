import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  roll_number: { type: String, required: true },
  enrolled_courses: [{ type: String }],
},({timestamps:true}));
const student = mongoose.model("student", studentSchema);

export default student;
