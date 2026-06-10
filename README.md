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

# Enterprise HRMS & Payroll Management System

## Project Overview

The Enterprise HRMS & Payroll Management System is a web-based platform designed to streamline employee management, leave approvals, and payroll operations within an organization. The system provides dedicated interfaces for employees and HR managers, enabling efficient workflow management while maintaining high security standards.

## User Roles

### Employee

Employees can securely access their accounts to manage day-to-day HR activities, including:

* Submitting leave requests
* Tracking leave status and approvals
* Viewing personal information
* Downloading monthly payroll reports and payslips

### HR Manager

HR managers have access to administrative tools that support workforce management, including:

* Reviewing and approving employee leave requests
* Managing employee records
* Monitoring organizational data through dashboards
* Generating company-wide reports
* Initiating payroll processing workflows

## Key Features

* Secure user authentication using JWT
* Role-based access control for employees and HR managers
* Leave management and approval workflow
* Payroll management and payslip generation
* Interactive analytics dashboard
* Employee data management
* Department and hierarchy tracking
* Real-time status updates and notifications

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
