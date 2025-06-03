import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }],
    department: { type: String },
  },
  { timestamps: true }
);
const teacher = mongoose.model("teacher", teacherSchema);

export default teacher;
