import constant from "../../constant";
import auth from "../middlewares/auth";
import authRole from "../middlewares/authRole";
import submission from "../controllers/submission";
export default (app: any, router: any) => {
  app.get(
    "/assigned/quiz/:id",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.get_quiz
  );
  app.post(
    "/quizzes/submit",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.submit_quiz
  );
  app.post(
    "/quizzes/result",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.result_quiz
  );
};
