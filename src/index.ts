import express, { urlencoded } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import "../connection";
import routes from "./routes";
import logger from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandle";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        scope: string;
        role?: string;
        assigned_quiz: "quiz";
      };
    }
  }
}

const router = express.Router();

const app: any = express();
const PORT: any = process.env.PORT || 3000;

/*******express middleware */
app.use(logger.loggerMiddleware); // logger middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/******router  */

app.use(router);
routes(app, router);

app.get("/", (_req: any, res: any) => {
  res.send("Hello from TypeScript!");
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
