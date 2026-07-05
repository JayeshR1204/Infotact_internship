async function run() {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@infotact.com', password: 'Admin@2026!' })
    });
    const loginData = await loginRes.json();
    console.log("Admin Login:", loginData);

    const token = loginData.token;
    const newEmp = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            name: "New Test",
            email: "newtest@infotact.com",
            password: "Password123!",
            department: "Sales",
            employeeId: "EMP-007",
            position: "Tester",
            salary: 40000
        })
    });
    console.log("Create Employee:", await newEmp.json());

    const newLogin = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'newtest@infotact.com', password: 'Password123!' })
    });
    console.log("New User Login Status:", newLogin.status);
    console.log("New User Login:", await newLogin.json());
}
run();
