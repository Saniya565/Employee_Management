import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

function calculate(body) {
  const basic = Number(body.basicSalary || 0), hra = Number(body.hra || 0),
    allowances = Number(body.allowances || 0), deductions = Number(body.deductions || 0),
    bonus = Number(body.bonus || 0);
  const grossSalary = basic + hra + allowances + bonus;
  const netSalary = grossSalary - deductions;
  const ctc = Number(body.ctc || grossSalary * 12);
  return { ...body, basicSalary: basic, hra, allowances, deductions, bonus, grossSalary, netSalary, ctc };
}
export async function getSalary(req, res) {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(await Salary.find({ employee: employee._id }).sort({ effectiveFrom: -1 }));
}
export async function createSalary(req, res) {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.status(201).json(await Salary.create(calculate({ ...req.body, employee: employee._id })));
}
export async function updateSalary(req, res) {
  const old = await Salary.findById(req.params.id);
  if (!old) return res.status(404).json({ message: "Salary record not found" });
  res.json(await Salary.findByIdAndUpdate(req.params.id, calculate(req.body), { new: true, runValidators: true }));
}
