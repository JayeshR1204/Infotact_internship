import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import LeaveRequests from "./pages/LeaveRequests";
import Payroll from "./pages/Payroll";
import Profile from "./pages/Profile";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/leave-requests" element={<LeaveRequests />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/profile" element={<Profile />} />

            </Routes>

        </BrowserRouter>

    );
}

export default App;
