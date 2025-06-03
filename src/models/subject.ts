import mongoose from "mongoose";

export const subjectSchema = new mongoose.Schema(
  {
    name: { type: String },
    course:{type:mongoose.Types.ObjectId,ref:"course"}
   
  },
);

const subject = mongoose.model("subject", subjectSchema);
export default subject;
