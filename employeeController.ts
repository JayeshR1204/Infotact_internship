import Employee from "../models/Employee";

export const getEmployeeDetails =
  async (req, res) => {
    try {
      const employee =
        await Employee.findById(
          req.params.id
        )
          .populate("department")
          .populate("manager");

      res.json(employee);
      
    } catch (error) {
      res.status(500).json({
        message: "Server Error",
      });
    }
  };