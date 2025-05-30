import userRoutes from "./user";
import quizRoutes from "./quiz";
import submission from "./submission";

export default (app: any, router: any) => {
  userRoutes(app, router), quizRoutes(app, router), submission(app, router);
};
