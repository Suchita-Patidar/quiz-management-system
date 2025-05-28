const jwt =require( "jsonwebtoken");
import { config } from "dotenv";
import { Request, Response , NextFunction } from "express";

config();
const jwt_secret = process.env.SECRET_KEY;
export default{ 
  authenticate : (req:Request, res:Response, next:NextFunction) => {
    console.log("Authentication middleware")
  const authHeader = req.headers.authorization || req.headers.Authorization as String;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
  return   res.status(401).json({ message: "Token is required" });
  }
  try {
    const token = authHeader.split(" ")[1];
    // console.log('token',token)
    const decode = jwt.verify(token, jwt_secret);
   ( req as any ).user = {
      userId: decode.userId,
      name: decode.name,
      scope: decode.scope,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
}
}
