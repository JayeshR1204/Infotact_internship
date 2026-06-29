import { Router } from "express";
import {
    createPayroll,
    getPayrolls
} from "../controllers/payrollController";

const router = Router();

router.post("/", createPayroll);

router.get("/", getPayrolls);

export default router;