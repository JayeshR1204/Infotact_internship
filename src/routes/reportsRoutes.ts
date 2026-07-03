import { Router } from "express";

import {
    payrollReport,
    departmentReport,
    activeEmployees
} from "../controllers/reportsController";

const router = Router();

router.get(
    "/payroll",
    payrollReport
);

router.get(
    "/departments",
    departmentReport
);

router.get(
    "/employees",
    activeEmployees
);

export default router;