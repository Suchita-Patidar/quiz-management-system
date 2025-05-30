import mongoose from "mongoose";

export const answerSchema = new mongoose.Schema(
  {
    question_no: { type: Number },
    submitted_answer: { type: String },
  },
  { timestamps: true }
);

const answer = mongoose.model("answer", answerSchema);
export default answer;
