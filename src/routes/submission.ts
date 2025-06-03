import constant from "../../constant";
import auth from "../middlewares/auth";
import authRole from "../middlewares/authRole";
import submission from "../controllers/submission";
export default (app: any, router: any) => {
  app.get(
    "/assigned/quiz/:quizId",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.get_quiz
  );
  app.get(
    "/assigned/allQuiz",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.get_allQuiz
  );
  app.post(
    "/quizzes/submit",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.submit_quiz
  );
  app.post(
    "/result/quiz/:quizId",
    auth.authenticate,
    authRole.authorizeRoles(constant.SCOPE.student),
    submission.result_quiz
  );
};
