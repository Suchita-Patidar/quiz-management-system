import { timeStamp } from "console";
import mongoose from "mongoose";
import { answerSchema } from "./answer";

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Types.ObjectId, ref: "user" },
  quiz: { type: mongoose.Types.ObjectId, ref: "quiz" },
  answer: [answerSchema],
  score: { type: Number },
  started_at: { type: Date },
  submission_time: { type: Date, default: Date.now() },
  quiz_duration: { type: Number },
  // meta_data:{}
},{timestamps:true});
const submission = mongoose.model("submission", submissionSchema);

export default submission;
