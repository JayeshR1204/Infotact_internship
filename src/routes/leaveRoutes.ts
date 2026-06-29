import { Router } from "express";
import {
    createLeaveRequest,
    getLeaveRequests
} from "../controllers/leaveController";

const router = Router();

router.post("/", createLeaveRequest);

router.get("/", getLeaveRequests);

export default router;