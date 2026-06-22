Project 1: 
Project 3: Enterprise HRMS & Payroll Automation Dashboard

Executive Problem Statement:

Enterprise HR departments struggle with fragmented data, managing employee onboarding, leave requests, and payroll across disparate spreadsheets. A highly secure, centralized Human Resource Management System (HRMS) is required to automate these workflows while strictly protecting Personally Identifiable Information (PII). 
This project requires the development of a secure HRMS using the MERN stack. The focus will be on complex state management on the frontend, rigorous Role-Based Access Control (RBAC) on the backend, and generating automated, downloadable payroll reports (PDFs) from raw database records.

Business Objectives and Key Performance Indicators:

The primary engineering objective is absolute data security and role isolation. An employee must never be able to access the payroll APIs designated for the HR Manager role. Success will be measured by the strict implementation of Express middleware to block unauthorized users, input sanitization, and data encryption. 

User Roles:

Employee:
Employees can securely access their accounts to manage day-to-day HR activities, including:

* Submitting leave requests
* Tracking leave status and approvals
* Viewing personal information
* Downloading monthly payroll reports and payslips

HR Manager:
HR managers have access to administrative tools that support workforce management, including:

* Reviewing and approving employee leave requests
* Managing employee records
* Monitoring organizational data through dashboards
* Generating company-wide reports
* Initiating payroll processing workflows

Technical Overview
Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Helmet.js Security Middleware
* Rate Limiting Protection

Frontend

* React
* TypeScript
* Tailwind CSS
* React Query / Redux Toolkit for state management

Update (11/06/2026):
Added a sample file named user.js to have a basic idea of how to create an user model
Update (12/06/2026):
Added a sample file named generatetoken.ts to have a basic idea of how to generate the token
Update (13/06/2026):
Created a placeholder for implementing authentication routes for user registration
Update (15/06/2026):
Created a sample file to handle user registration and login functionality with password encryption and JWT token generation.
Update (16/06/2026):
Added employee detail retrieval endpoint to fetch employee information and related department and manager data from the database.
Update (17/06/2026):
Add Payroll schema and employee mapping for salary tracking and payslips.
Update (18/06/2026):
Add leave management endpoints update the leave policy for the employees
Update (19/06/2026) :
Implemented Department model for managing the employee's detail
Update (22/06/2026) :
Created a centralized Axios service with automatic JWT token attachment for secure backend API communication.
Implemented global authentication state management with persistent JWT storage and logout functionality.


