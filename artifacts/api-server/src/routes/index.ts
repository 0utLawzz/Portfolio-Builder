import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import contactRouter from "./contact";
import adminRouter from "./admin";
import statsRouter from "./stats";
import githubRouter from "./github";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(statsRouter);
router.use(githubRouter);

export default router;
