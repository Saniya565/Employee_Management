import Intern from "../models/Intern.js";
import Employee from "../models/Employee.js";

export async function listInterns(req, res) {
  const { search = "", status } = req.query;
  const query = {};
  if (search) query.$or = [
    { name: { $regex: search, $options: "i" } },
    { internId: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } }
  ];
  if (status) query.status = status;
  res.json(await Intern.find(query).sort({ createdAt: -1 }));
}
export async function getIntern(req, res) {
  const item = await Intern.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Intern not found" });
  res.json(item);
}
export async function createIntern(req, res) {
  res.status(201).json(await Intern.create(req.body));
}
export async function updateIntern(req, res) {
  const item = await Intern.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Intern not found" });
  res.json(item);
}
export async function deleteIntern(req, res) {
  const item = await Intern.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Intern not found" });
  res.json({ message: "Intern deleted" });
}
export async function convertIntern(req, res) {
  const intern = await Intern.findById(req.params.id);
  if (!intern) return res.status(404).json({ message: "Intern not found" });
  const employeeId = req.body.employeeId || `EMP-${Date.now().toString().slice(-6)}`;
  const employee = await Employee.create({
    employeeId, fullName: intern.name, email: intern.email, phone: intern.phone || "N/A",
    department: intern.department || "Technology", designation: intern.internshipRole || "Junior Developer",
    employmentType: "Full-time", dateOfJoining: new Date(), employmentStatus: "Active"
  });
  intern.status = "Completed";
  await intern.save();
  res.status(201).json({ employee, message: "Intern converted to employee" });
}
