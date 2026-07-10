import { Router } from "express";

import {
    fetchEmployees,
    createEmployee,
    employeeCountReport,
} from "../controllers/employeeController";

const router = Router();

router.get("/", fetchEmployees);

router.post("/", createEmployee);

router.get("/department-report", employeeCountReport);

export default router;
