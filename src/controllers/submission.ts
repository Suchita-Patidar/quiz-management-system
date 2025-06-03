import { NextFunction, Request, Response } from "express";
import db from "../models/index";
import { HttpError } from "../utils/HttpError";

export default {
  get_quiz: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("inside get quize for completing it");
     const _id=req.user?.userId
      const {quizId}:any=req.params
    
      if (!quizId) {
        throw new HttpError(400, "quiz id is required ");
      }

      const student=await db.student.findOne({user:_id})
console.log(student?.assigned_quiz)
   const isQuizAssigned = student?.assigned_quiz.some(id => id.equals(quizId));
         if(!isQuizAssigned){
        throw new HttpError(401,"No quiz is assigned to you for this quiz id ")
      }
      const quiz = await db.quiz.findOne({_id:quizId}, {
        _id: 0,
        created_by: 0,
        updatedAt:0,
        __v:0,
        createdAt:0,
        "questions.type": 0,
        "questions.createdAt": 0,
        "questions.updatedAt": 0,
        "questions._id": 0,
        "questions.options.isCorrect": 0,
        "questions.options._id": 0,
        "questions.options.createdAt": 0,
        "questions.options.updatedAt": 0,
      });
      if(!quiz){
        throw new HttpError(401,"quiz is not  found for this quiz id ")
      }

      res.status(200).json({ message: "QUiz fetch successfully", quiz: quiz });
    } catch (error) {
      next(error);
    }
  },
  submit_quiz: async (req: Request, res: Response, next: NextFunction) => {
    console.log("Inside SUBMIT QUIZ FUNCTION");

    try {
      const { answer } = req.body;
      let { started_at } = req.body;
      const { quizId } = req.body;

      const userId: any = req.user?.userId;
    
      if (!answer || !started_at || !quizId) {
        throw new HttpError(
          400,
          "answer,started time and quiz id is required "
        );
      }
      if (!Array.isArray(answer)) {
        throw new HttpError(
          400,
          "Answer  array are required to submiting quiz"
        );
      }
     
      started_at = new Date(started_at);

   

      const student = await db.student.findOne({ user:req.user?.userId });
      // console.log(student)
      // console.log(student?.assigned_quiz)
      // console.log(quizId)
      const isAssigned=student?.assigned_quiz.some(id => id.equals(quizId))
      if (!isAssigned) {
        throw new HttpError(
          401,
          "user does not assigned this quiz ,you are submitting wrong quiz"
        );
      }

      const existingSubmission = await db.submission.find({
        student: userId,
        quiz: quizId,
      });

      if (existingSubmission.length >= 3) {
        // console.log(existingSubmission)
        throw new HttpError(
          400,
          "you have already submit your quiz and can not resubmit it"
        );
      }

      const submission_time = new Date();
      let durationMs = submission_time.getTime() - started_at.getTime();
      let duration = durationMs / (1000 * 60); //in minutes

      const assignQuiz = await db.quiz.findOne({quiz:quizId});
      const quizDuration = assignQuiz?.duration || 10;

      if (quizDuration < duration) {
        throw new HttpError(400, "Time out of quiz submission");
      }
      // console.log(submission_time,duration)

      const quiz = await db.quiz.findById(quizId);
      const quiz_question = quiz?.questions || [];

      let marks = 0;
      if (answer.length == 0) {
        marks = 0;
        const submit = await db.submission.create({
          student: userId,
          quiz: quizId,
          answer: [],
          score: marks,
          started_at: started_at,
          submission_time: submission_time,
          quiz_duration: duration,
        });
        return res
          .status(200)
          .json({ message: "Successfully! quiz is submitted ....." });
        // console.log("submission data",submit)
      }

      for (let i = 0; i < answer.length; i++) {
        let ans = answer[i];

        if (!ans._id) {
          throw new HttpError(400, "question id is required");
        }

        if (ans.submitted_answer) {
          // Find the matching question by question_no
          const question = quiz_question.find(
            (q: any) => q._id == ans._id
          );

          if (!question) {
            throw new HttpError(404, `Question ${ans._id} not found`);
          }

          const assign_marks = question.marks;

          const matchedOption = question.options.find(
            (opt: any) => opt.text === ans.submitted_answer
          );

          if (matchedOption?.isCorrect) {
            marks += assign_marks;
          }
        }
      }

      // console.log(marks)
      const submission = await db.submission.create({
        student: userId,
        quiz: quizId,
        answer: answer,
        score: marks,
        started_at: started_at,
        submission_time: submission_time,
        quiz_duration: duration,
      });
      // console.log("Submission data",submission)
      res
        .status(200)
        .json({ message: "Successfully! quiz is submitted ....." });
    } catch (err: any) {
      next(err);
    }
  },
  result_quiz: async (req: Request, res: Response, next: NextFunction) => {
    console.log("INside result_quiz function  ........");
    try {
      const { quizId } = req.params;
      const userId: any = req.user?.userId;

    
      const quiz = await db.quiz.findById(quizId);
      if (!quiz) {
        throw new HttpError(400, "oops! you give wrong Quiz id");
      }
      const quizTitle = quiz.title;
      const submission = await db.submission.find({
        student: userId,
        quiz: quizId,
      });
      console.log(submission)
      if (submission.length == 0) {
        throw new HttpError(
          400,
          `you do not submit quiz with student Id ${userId} and quiz Id ${quizId}`
        );
      }
      // console.log(submission.score);
      const scores = submission.map(detail => detail.score);

      // const achieved_score = submission[0].score || 0;
  return  res.status(200).json({ quiz: quizTitle, score: scores });
    } catch (error) {
      next(error);
    }
  },
  get_allQuiz:async(req:Request,res:Response,next:NextFunction)=>{
    try{
         console.log("INside get all quiz function ")
         const student =await db.student.findOne({user:req.user?.userId}) 
         const assigned_quiz=student?.assigned_quiz||[]
         if(assigned_quiz?.length >0){

      const assignedQuizDetails = [];

for (const id of assigned_quiz) {
  try {
    const quiz = await db.quiz.findById(id,
      { 
        updatedAt:0,
        __v:0,
        createdAt:0,
        "questions.type": 0,
        "questions.createdAt": 0,
        "questions.updatedAt": 0,
        "questions.options.isCorrect": 0,
        "questions.options._id": 0,
        "questions.options.createdAt": 0,
        "questions.options.updatedAt": 0,
      }
    );
    if (quiz) {
      assignedQuizDetails.push(quiz);
    }
  } catch (error) {
   throw  new HttpError(400,`Error fetching quiz with ID ${id}:`);
  }
}


          return res.status(200).json({asigned_quiz_id :assignedQuizDetails})
         }
         throw new HttpError(400," No any quiz is not assigned to you ")


    }
    catch(error:any){
      next(error)
  }
}
}
