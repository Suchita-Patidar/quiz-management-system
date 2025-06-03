import { NextFunction, Request, Response } from "express";
import { questionType } from "../models/question";
import { HttpError } from "../utils/HttpError";
import db from "../models/index";
import student from "../models/student";
import mongoose from 'mongoose';
import { AnyARecord } from "node:dns";
export default {
  add_quize: async (req: Request, res: Response, next: NextFunction) => {
    console.log("ADD quize function");
    try {
      const { title, description, questions, duration, total_marks } = req.body;
      const created_by = req.user?.userId;
      if (!title || !duration || !total_marks) {
        throw new HttpError(400, "title,duration,total_marks are required");
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new HttpError(400, "at least one question is required");
      }
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (!question.text) {
          throw new HttpError(400, `Question ${i + 1} is missing 'text'`);
        }
        if (!question.question_no){
          question.question_no=i+1
        }
        if (
          ![questionType.multipleChoice, questionType.trueFalse].includes(
            question.type
          )
        ) {
          throw new HttpError(400, `Question ${i + 1} has invalid 'type'`);
        }
        if (!Array.isArray(question.options) || question.options.length === 0) {
          throw new HttpError(400, "At least two option is required");
        }

        for (let j = 0; j < question.options.length; j++) {
          const option = question.options[j];
          if (!option.text) {
            throw new HttpError(
              400,
              `Option ${j + 1} in question ${i + 1} is missing 'text'`
            );
          }
          if (typeof option.isCorrect !== "boolean") {
            throw new HttpError(
              400,
              `Option ${j + 1} in question ${
                i + 1
              } must have 'isCorrect' as boolean`
            );
          }
        }
      }

      // Create and save the quiz
      const quiz = new db.quiz({
        title,
        description,
        duration,
        created_by,
        questions,
        total_marks,
      });
      const savedQuiz = await quiz.save();

      return res
        .status(201)
        .json({ message: "Quiz created successfully", quiz: savedQuiz });
    } catch (err: any) {
      next(err);
    }
  },
  get_quizzes: async (req: Request, res: Response, next: NextFunction) => {
    console.log("inside get_quizzes function")
    /*******Every teacher can see all quizzes */
    try {

      const quizzes = await db.quiz.find(
        {created_by:req.user?.userId},
        {
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
          created_by: 0,
          updatedAt: 0,
          __v:0
        }
      );
    if(!quizzes){
      return res.status(200).json({message:"NO quiz is found "})
    }
      return res.status(200).json({ quizes: quizzes });
    } catch (error: any) {
      next(error);
    }
  },
  assign_quize: async (req: Request, res: Response, next: NextFunction) => {
    console.log("Inside assign_quiz ");
    /*****teacher assign a quiz to a student  */
    /********teacher use token */
    try {
      // const {id}:any  = req.params;

      const quizId= req.body.quiz;
      const studentId=req.body.studentId;
      const teacherId = req.user?.userId;
 
      const student = await db.student.findOne({user:studentId});
     
      if (!student) {
        throw new HttpError(400, "No student is found");
      }

     const quiz = await db.quiz.find({ created_by: teacherId ,_id:quizId})
       if(!quiz){
     
     throw new HttpError(400, "Quiz with this quiz id is not found in this teacher scope");
      }

     const assigned_quiz=student?.assigned_quiz
           const isAsigned=assigned_quiz.some(id => id.equals(quizId))
         if(isAsigned){
          throw new HttpError(400,'This quiz is already assign to this student,give another quiz id to assign quiz ')
         }

  student.assigned_quiz.push(...quizId);
    await student.save();

      
  
      return res.status(200).json({
        message: `Student ${studentId}  have a new quiz assign  ${quizId}`,
      });
    } catch (error: any) {
      next(error);
    }
  },
};
