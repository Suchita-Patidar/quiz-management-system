import mongoose from "mongoose";
import { questionSchema } from "./question";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number }, // in minutes time duration
    questions: [questionSchema],
    total_marks: { type: Number },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
  },
  { timestamps: true }
);
const quiz = mongoose.model("quiz", quizSchema);
export default quiz;
