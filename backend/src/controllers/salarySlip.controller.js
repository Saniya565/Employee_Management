import PDFDocument from "pdfkit";
import SalarySlip from "../models/SalarySlip.js";
import Employee from "../models/Employee.js";

export async function createSlip(req, res) {
  const employee = await Employee.findById(req.body.employee);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  const basic = Number(req.body.basicSalary || 0), allowances = Number(req.body.allowances || 0),
    deductions = Number(req.body.deductions || 0), bonus = Number(req.body.bonus || 0);
  const grossSalary = basic + allowances + bonus, netSalary = grossSalary - deductions;
  const slip = await SalarySlip.create({ ...req.body, basicSalary: basic, allowances, deductions, bonus, grossSalary, netSalary });
  res.status(201).json(slip);
}
export async function slipPdf(req, res) {
  const slip = await SalarySlip.findById(req.params.id).populate("employee", "employeeId fullName department designation");
  if (!slip) return res.status(404).json({ message: "Salary slip not found" });
  const doc = new PDFDocument({ margin: 55 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="salary-slip-${slip.employee.employeeId}-${slip.month}-${slip.year}.pdf"`);
  doc.pipe(res);
  doc.fontSize(22).text("SCORECARE", { align: "center" });
  doc.fontSize(15).text("SALARY SLIP", { align: "center" });
  doc.moveDown(2);
  doc.fontSize(11).text(`Employee: ${slip.employee.fullName} (${slip.employee.employeeId})`);
  doc.text(`Department: ${slip.employee.department}`);
  doc.text(`Designation: ${slip.employee.designation}`);
  doc.text(`Period: ${String(slip.month).padStart(2, "0")}/${slip.year}`);
  doc.moveDown();
  doc.text(`Basic Salary: ₹${slip.basicSalary.toLocaleString("en-IN")}`);
  doc.text(`Allowances: ₹${slip.allowances.toLocaleString("en-IN")}`);
  doc.text(`Bonus: ₹${slip.bonus.toLocaleString("en-IN")}`);
  doc.text(`Deductions: ₹${slip.deductions.toLocaleString("en-IN")}`);
  doc.moveDown();
  doc.fontSize(13).text(`Gross Salary: ₹${slip.grossSalary.toLocaleString("en-IN")}`);
  doc.text(`Net Salary: ₹${slip.netSalary.toLocaleString("en-IN")}`);
  doc.moveDown(3);
  doc.fontSize(9).text("This is a system-generated salary slip.");
  doc.end();
}
