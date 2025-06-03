import mongoose from "mongoose";

export const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }, // only for mcq
    // option_no:{type : Number}  //only for mcq
  },
  { timestamps: true }
);

// const option = mongoose.model("option", optionSchema);
// export default option;
