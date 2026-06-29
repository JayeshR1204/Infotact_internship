import { Router } from "express";
import { fetchEmployees } from "../controllers/employeeController";

const router = Router();

router.get("/", fetchEmployees);

export default router;