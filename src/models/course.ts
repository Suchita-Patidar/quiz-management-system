import mongoose from "mongoose";

export const courseSchema = new mongoose.Schema(
  {
    name: { type: String },
   
  },
);

const course = mongoose.model("course", courseSchema);
export default course;
