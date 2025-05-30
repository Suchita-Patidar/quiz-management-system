import { Request, Response, NextFunction } from "express";

export default {
  authorizeRoles: (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user; // assuming req.user is set by auth middleware
      console.log("Role based middleware");
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: No user info" });
      }

      if (!allowedRoles.includes(user.scope)) {
        return res.status(403).json({
          message: "Insufficient role,only admin can see user detail ",
        });
      }

      next();
    };
  },
};
