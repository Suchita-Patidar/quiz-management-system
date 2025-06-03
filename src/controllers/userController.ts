import db from "../models";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");
import mongoose from "mongoose";
import { HttpError } from "../utils/HttpError";
const secret_key = process.env.SECRET_KEY;
import { Request, Response, NextFunction } from "express";
import constant from "../../constant";

export default {
  /***********User Registration******* */
  addUser: async (req: Request, res: Response, next: NextFunction) => {
    console.log("User Registration scope ----> ");

    const { name, email, password, age, gender, scope } = req.body;
    // console.log('user')

    try {
      if (!name || !email || !password || !scope) {
        throw new HttpError(400, "All field are required"); //error handling middleware
      }
      if (email) {
        const existingEmail = await db.user.findOne({ email: email });

        if (existingEmail) {
          throw new HttpError(400, "email already exists");
        }
      }

      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(14));

      if (scope == constant.SCOPE.student) {
        console.log("Student scope --->");
        const { roll_number, enrolled_courses } = req.body;
       

        if (!roll_number || !enrolled_courses) {
          throw new HttpError(400, "Roll number and  coures are required");
        }
 
     const validCourses = await db.course.find({ _id: { $in: enrolled_courses } });

    if (validCourses.length !== enrolled_courses.length) {
      throw new HttpError(
      400 ,'One or more enrolled courses IDs are invalid'
      );
    }

        try {
          const rollNo = await db.student.findOne({ roll_number: roll_number });
          if (rollNo) {
            throw new HttpError(400, "student with this roll_no already exists ,change roll number");
          }
          const newUser = await db.user.create({
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            scope: constant.SCOPE.student,
            age: age,
          });
          // console.log(newUser);

          await db.student.create({
            user: newUser?._id,
            roll_number: roll_number,
            enrolled_courses: enrolled_courses,
          });
          return res.status(200).json({
            Successs: true,
            message: " Student user register successfully",
          });
        } catch (err:any) {
          return next(err);
        }
      }
      if (scope == constant.SCOPE.teacher) {
        console.log("Teacher scope ---->");
        const { department, subjects } = req.body;
        if (!department || !subjects) {
          throw new HttpError(400, "department and subjects  are required");
        }

           const validSubject = await db.subject.find({ _id: { $in: subjects } });

    if (validSubject.length !== subjects.length) {
      throw new HttpError(
      400 ,'One or more subject IDs are invalid'
      );
    }
        try {
          const newUser = await db.user.create({
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            scope: constant.SCOPE.teacher,
            age: age,
          });

          await db.teacher.create({
            user: newUser._id,
            department: department,
            subjects: subjects,
          });
          return res.status(200).json({
            Successs: true,
            message: " Teacher user register successfully",
          });
        } catch (err: any) {
          return next(err);
        }
      }
        
     return res.status(200).json({message :"user does not belons to valid scope"})
    } catch (err: any) {
      console.log("Error ===", err.message);
      return next(err);
    }
  },
  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new HttpError(400, "All field are required");
    }
    try {
      let existingUser = await db.user.findOne({ email: email });
      //    console.log(existingUser.email)
      if (!existingUser) {
        throw new HttpError(400, "Invalid user email ");
      }

      const isValid = bcrypt.compareSync(password, existingUser.password);

      if (isValid == false) {
        throw new HttpError(400, "Invalid user email or password");
      } else {
        const token = jwt.sign(
          {
            userId: existingUser._id,
            name: existingUser.name,
            scope: existingUser.scope,
          },
          secret_key,
          { expiresIn: constant.TOKENEXPIRE.duration }
        );
        // console.log(existingUser.email)
        // console.log(existingUser._id)
        // res.send("user login")
        return res.status(200).json({ data: { token: token } });
      }
    } catch (error) {
      return next(error);
    }
  },
  userProfile: async (req: Request, res: Response, next: NextFunction) => {
    console.log("USer Profile ");

    const userId = req.user?.userId;

    const scope = req.user?.scope;
    try {
      const user = await db.user.findById(userId, '-password -createdAt -updatedAt -_id -__v' );
      let rollDetails;
      if (scope == constant.SCOPE.student) {
        rollDetails = await db.student
          .findOne({ user: new mongoose.Types.ObjectId(userId) },{
            _id:0,
            "roll_number":1,
            "enrolled_courses":1
          })
          
      }
      if (scope == constant.SCOPE.teacher) {
        rollDetails = await db.teacher.findOne({
          
        },{
          _id:0,
          "department":1,
          "subjects":1
        }
      );
        
      }
      res.status(200).json({
        user,
        rollDetails,
      });
    } catch (err: any) {
      next(err);
    }
  },

  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {


      const scope=req.user?.scope;

      if(scope == constant.SCOPE.student){

              const users = await db.user.find({scope:constant.SCOPE.student}, '-password -createdAt -updatedAt  -__v');
                return res.status(200).json({success: true,users:users})
      }

      else if(scope == constant.SCOPE.teacher){
              const users = await db.user.find({scope:constant.SCOPE.student}, '-password -createdAt -updatedAt  -__v');
               return res.status(200).json({success:true,users:users})      
      }




      const users = await db.user.find({}, '-password -createdAt -updatedAt  -__v');
      res.status(200).json({ success: true, users: users });
    } catch (err: any) {
      next(err);
    }
  },
};
