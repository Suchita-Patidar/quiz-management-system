import constant from "../../constant";
import auth from "../middlewares/auth";
import authRole from "../middlewares/authRole";
import submission from "../controllers/submission";
export default (app: any, router: any) => {
  app.post(
    "/assigned/:id",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.get_quiz
  );
  app.post(
    "/quizzes/submit/:id",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.submit_quiz
  );
  app.post(
    "/quizzes/result/student/:id",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.result_quiz
  );
};
