import { NextFunction, Request, Response } from "express";
import db from "../models/index";
import { HttpError } from "../utils/HttpError";
import student from "../models/student";
import mongoose from "mongoose";
// interface StudentType {
//   assigned_quiz: assigned_quiz; // Add the field here
//   // other student fields...
// }
export default {
  get_quiz: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("inside get quize for completing it");
      const id: any = req.params;
      const studentId = new mongoose.Types.ObjectId(id);
      const student = await db.student.findById(studentId);
      console.log(student);
      if (!student) {
        throw new HttpError(400, " Student User not found ");
      }
      const assigned_id = student?.assigned_quiz;
      console.log(assigned_id);
      if (!assigned_id) {
        throw new HttpError(400, "quiz is not assigned to you ");
      }
      // console.log(assigned_id);
      const quiz = await db.quiz.findOne(assigned_id, {
        _id: 0,
        createdAt: 0,
        "questions.type": 0,
        "questions.createdAt": 0,
        "questions.updatedAt": 0,
        "questions._id": 0,
        "questions.options.isCorrect": 0,
        "questions.options._id": 0,
        "questions.options.createdAt": 0,
        "questions.options.updatedAt": 0,
      });

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
      let { quizId } = req.body;

      const studentId: any = req.user?.userId;
      const studentObjectId = new mongoose.Types.ObjectId(studentId);
      //  console.log(studentObjectId,quizId)

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
      quizId = new mongoose.Types.ObjectId(quizId);
      started_at = new Date(started_at);

      if (
        !mongoose.Types.ObjectId.isValid(studentObjectId) ||
        !mongoose.Types.ObjectId.isValid(quizId)
      ) {
        return res.status(400).json({ message: "Invalid studentId or quizId" });
      }

      const student = await db.student.findOne({ user: studentObjectId });
      // console.log(student)
      // console.log(student?.assigned_quiz)
      // console.log(quizId)
      if (student?.assigned_quiz.toString() !== quizId.toString()) {
        throw new HttpError(
          401,
          "user does not assigned this quiz ,you are submitting wrong quiz"
        );
      }

      const existingSubmission = await db.submission.find({
        student: studentObjectId,
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

      const assignQuiz = await db.quiz.findOne(quizId);
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
          student: studentObjectId,
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

        if (!ans.question_no) {
          throw new HttpError(400, "question number is required");
        }

        if (ans.submitted_answer) {
          // Find the matching question by question_no
          const question = quiz_question.find(
            (q: any) => q.question_no == ans.question_no
          );

          if (!question) {
            throw new HttpError(404, `Question ${ans.question_no} not found`);
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
        student: studentObjectId,
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
      const { quizId } = req.body;
      const studentId: any = req.user?.userId;

      const studentObjectId = new mongoose.Types.ObjectId(studentId);
      const quizObjectId = new mongoose.Types.ObjectId(quizId);
      const quiz = await db.quiz.findById(quizId);
      if (!quiz) {
        throw new HttpError(400, "oops! you give wrong Quiz id");
      }
      const quizTitle = quiz.title;
      const submission = await db.submission.find({
        student: studentObjectId,
        quiz: quizObjectId,
      });
      console.log(submission)
      if (submission.length == 0) {
        throw new HttpError(
          400,
          `you do not submit quiz with student Id ${studentId} and quiz Id ${quizId}`
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
};
