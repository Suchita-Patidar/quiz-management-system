import authRole from "../middlewares/authRole";
import auth from "../middlewares/auth";
import constant from "../../constant";
import quizController from "../controllers/quizController";
export default (app: any, router: any) => {
  app.post(
    "/quizzes",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.teacher),
    quizController.add_quize
  );

  app.get(
    "/quizzes",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.teacher),
    quizController.get_quizzes
  );
  app.post(
    "/quizzes/assign/student/:id",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.teacher),
    quizController.assign_quize
  );
};
