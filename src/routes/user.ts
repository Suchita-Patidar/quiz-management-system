import userController from "../controllers/userController";
import authRole from "../middlewares/authRole";
import auth from "../middlewares/auth";
import constant from "../../constant";

export default (app: any, router: any) => {
  /***********User***********/
  app.post("/auth/register", userController.addUser);

  app.post("/auth/login", userController.loginUser);

  app.get("/users/me", auth.authenticate, userController.userProfile);

  /***********Role based ,token based middleware used  */

  // only admin can read users data

  app.get(
    "/users",
    auth.authenticate,
    userController.getAllUsers
  );
};
