import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";
import Document from "../models/Document.js";
import Offer from "../models/Offer.js";

export async function listEmployees(req, res) {
  const { search = "", department, status, employmentType, sort = "-createdAt", page = 1, limit = 20 } = req.query;
  const query = {};
  if (search) query.$or = [
    { fullName: { $regex: search, $options: "i" } },
    { employeeId: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } }
  ];
  if (department) query.department = department;
  if (status) query.employmentStatus = status;
  if (employmentType) query.employmentType = employmentType;

  const pageNum = Math.max(1, Number(page));
  const lim = Math.min(100, Math.max(1, Number(limit)));
  const [items, total] = await Promise.all([
    Employee.find(query).sort(sort).skip((pageNum - 1) * lim).limit(lim),
    Employee.countDocuments(query)
  ]);
  res.json({ items, total, page: pageNum, pages: Math.ceil(total / lim) });
}

export async function getEmployee(req, res) {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  const [salaryHistory, documents, offers] = await Promise.all([
    Salary.find({ employee: employee._id }).sort({ effectiveFrom: -1 }),
    Document.find({ employee: employee._id }).sort({ uploadDate: -1 }),
    Offer.find({ employee: employee._id }).sort({ offerDate: -1 })
  ]);
  res.json({ employee, salaryHistory, documents, offers });
}

export async function createEmployee(req, res) {
  const existing = await Employee.findOne({ $or: [{ employeeId: req.body.employeeId }, { email: req.body.email }] });
  if (existing) return res.status(409).json({ message: "Employee ID or email already exists" });
  const employee = await Employee.create(req.body);
  res.status(201).json(employee);
}

export async function updateEmployee(req, res) {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee);
}

export async function deleteEmployee(req, res) {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  await Promise.all([
    Salary.deleteMany({ employee: employee._id }),
    Document.deleteMany({ employee: employee._id }),
    Offer.deleteMany({ employee: employee._id })
  ]);
  res.json({ message: "Employee deleted" });
}
