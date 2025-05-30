import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    roll_number: { type: String, required: true },
    enrolled_courses: [{ type: String }],
    assigned_quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quiz", // This refers to the Quiz model
      default: null,
    },
  },
  { timestamps: true }
);
const student = mongoose.model("student", studentSchema);

export default student;
