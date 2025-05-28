import mongoose from "mongoose";
import {optionSchema}from "./option";

export enum questionType {
    multipleChoice  = "1",
    trueFalse   = "2",

}
export const questionSchema=new mongoose.Schema({
    text:{type :String},
    question_no:{type:Number},
    type:{
        type :String,
        enum:questionType,
        default:"1"
    },
    marks:{
        type:Number,
        default:1
    },
    option:[optionSchema], // only for mcq
    correct_answer:{type: String} //true false and short answer 
},({timestamps:true})
)
const question = mongoose.model('question',questionSchema)

export default question;