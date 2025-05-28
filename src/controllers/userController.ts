import db from "../models";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");
import mongoose from "mongoose";
import { HttpError } from "../utils/HttpError";
const secret_key = process.env.SECRET_KEY;
import { Request, Response ,NextFunction} from "express";
import constant from "../../constant";

export default {
  /***********User Registration******* */
  addUser: async (req: Request, res: Response,next:NextFunction) => {
    console.log("User Registration scope ----> ");

    const { name, email, password, age, gender, scope } = req.body;
    // console.log('user')

    try {
      if (!name || !email || !password || !scope) {
        throw new HttpError(400,"All field are required" );    //error handling middleware
      }
      if (email) {
        const existingEmail = await db.user.findOne({ email: email });

        if (existingEmail) {
          throw new HttpError(400, "email already exists" );
        }
      }

      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(14));

      if (scope == constant.SCOPE.student) {
        console.log("Student scope --->");
        const { roll_number, enrolled_courses } = req.body;
        console.log(roll_number, enrolled_courses);
        if (!roll_number || !enrolled_courses) {
          throw new HttpError(400, "Roll number and  coures are required");
        }

        try {
          const rollNo = await db.student.findOne({ rollNumber: roll_number });
          if (rollNo) {
            throw new HttpError(400,"student already exists" );
          }
          const newUser = await db.user.create({
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            scope: scope,
            age: age,
          });
          console.log(newUser);

          await db.student.create({
            user: newUser._id,
            roll_number: roll_number,
            enrolled_courses: enrolled_courses,
          });
             return  res.send(200).json({Successs:true, message:" Student user register successfully", });
        } catch (err) {
          next(err)
        }
      }
      if (scope == constant.SCOPE.teacher) {
        console.log("Teacher scope ---->");
        const { department, subjects } = req.body;
        if (!department || !subjects) {
          throw new HttpError(    400,"department and subjects  are required"  );
        }
        try {
          const newUser = await db.user.create({
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            scope: scope,
            age: age,
          });

          await db.teacher.create({
            user: newUser._id,
            department: department,
            subjects: subjects,
          });
             return  res.send(200).json({Successs:true, message:" Teacher user register successfully", });
        } catch (err:any) {
          next(err)
        }
      }
      // Commit all if successful
      const newUser = await db.user.create({
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            scope: scope,
            age: age,
          });
             return  res.send(200).json({Successs:true, message:" Admin user register successfully", });

    } catch (err: any) {
      console.log("Error ===", err.message);
      next(err)
    }
  },
  loginUser: async (req: Request, res: Response,next : NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new HttpError(400, "All field are required");
      
    }
    try {
      let existingUser = await db.user.findOne({ email: email });
      //    console.log(existingUser.email)
      if (!existingUser) {
        throw new HttpError(400, "Invalid user email ",);
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
        res.status(200).json({ data: { token: token } });
      }
    } catch (error) {
      next(error)
    }
  },
  userProfile: async (req: Request, res: Response,next:NextFunction) => {
    console.log("USer Profile ")

    const userId=req.user?.userId ;

    const scope=req.user?.scope
    try{
    const user=await db.user.findById(userId);
    let rollDetails;
    if (scope == constant.SCOPE.student){
        rollDetails=await db.student.findOne({user: new mongoose.Types.ObjectId(userId) }).populate('user')
    }
    if(scope == constant.SCOPE.teacher){
        rollDetails=await db.teacher.findOne({user: new mongoose.Types.ObjectId(userId) })
    }
    res.status(200).json({
        user,
        rollDetails,
    })
}
    catch(err:any){
        next(err)
    }
  },

  getAllUsers: async (req: Request, res: Response,next:NextFunction) => {
    try{
    const users=await db.user.find()
    res.status(200).json({success:true,users:users})
    }
    catch(err:any){
        next(err)
    }
  },
};
