// EmployeeStats.jsx
import React from "react";

const EmployeeStats = () => {
  const stats = [
    { title: "Total Employees", value: 120 },
    { title: "Present Today", value: 105 },
    { title: "On Leave", value: 10 },
    { title: "New Hires", value: 5 },
  ];

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            width: "200px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>{stat.title}</h3>
          <h2>{stat.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default EmployeeStats;
