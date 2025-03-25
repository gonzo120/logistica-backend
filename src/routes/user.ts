import { Router, RequestHandler } from "express";
import { CreateUser, LoginUser, ReadUser } from "../controllers/user";

const router = Router();

router.get("/api/user/read", ReadUser as RequestHandler);
router.post("/api/user/create", CreateUser as RequestHandler);
router.post("/api/user/register", CreateUser as RequestHandler);
router.post("/api/user/login", LoginUser as RequestHandler);

export default router;
