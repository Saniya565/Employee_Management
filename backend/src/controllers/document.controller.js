import fs from "fs";
import Document from "../models/Document.js";
import Employee from "../models/Employee.js";

export async function listDocuments(req, res) {
  res.json(await Document.find({ employee: req.params.id }).sort({ uploadDate: -1 }));
}
export async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ message: "Please select a file" });
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  const doc = await Document.create({
    employee: employee._id, documentName: req.body.documentName || req.file.originalname,
    documentType: req.body.documentType || "Other", fileName: req.file.originalname,
    filePath: req.file.path, mimeType: req.file.mimetype, status: "Pending"
  });
  res.status(201).json(doc);
}
export async function deleteDocument(req, res) {
  const doc = await Document.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });
  if (doc.filePath && fs.existsSync(doc.filePath)) fs.unlinkSync(doc.filePath);
  res.json({ message: "Document deleted" });
}
