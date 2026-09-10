import Employee from "../models/Employee.js";
import Intern from "../models/Intern.js";
import Department from "../models/Department.js";

export async function dashboard(req, res) {
  const now = new Date();
  const next30 = new Date(now);
  next30.setDate(next30.getDate() + 30);

  const [
    totalEmployees, totalInterns, activeEmployees, inactiveEmployees,
    probationEmployees, completedProbation, departments, recentEmployees,
    upcomingJoining
  ] = await Promise.all([
    Employee.countDocuments(),
    Intern.countDocuments(),
    Employee.countDocuments({ employmentStatus: "Active" }),
    Employee.countDocuments({ employmentStatus: { $in: ["Inactive", "Resigned", "Terminated", "Relieved"] } }),
    Employee.countDocuments({ employmentStatus: "Active", probationEndDate: { $gte: now } }),
    Employee.countDocuments({ employmentStatus: "Active", probationEndDate: { $lt: now } }),
    Department.countDocuments(),
    Employee.find().sort({ createdAt: -1 }).limit(5).select("employeeId fullName department designation dateOfJoining employmentStatus"),
    Employee.find({ dateOfJoining: { $gte: now, $lte: next30 } }).sort({ dateOfJoining: 1 }).limit(5).select("employeeId fullName dateOfJoining department")
  ]);

  const byDepartment = await Employee.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
  const byStatus = await Employee.aggregate([{ $group: { _id: "$employmentStatus", count: { $sum: 1 } } }]);

  res.json({
    stats: { totalEmployees, totalInterns, activeEmployees, inactiveEmployees, probationEmployees, completedProbation, departments },
    recentEmployees, upcomingJoining,
    charts: { byDepartment, byStatus }
  });
}
