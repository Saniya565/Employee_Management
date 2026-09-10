import PDFDocument from "pdfkit";
import Offer from "../models/Offer.js";
import Employee from "../models/Employee.js";

export async function listOffers(req, res) {
  res.json(await Offer.find().populate("employee", "employeeId fullName").sort({ createdAt: -1 }));
}
export async function createOffer(req, res) {
  const offer = await Offer.create(req.body);
  res.status(201).json(offer);
}
export async function updateOffer(req, res) {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!offer) return res.status(404).json({ message: "Offer not found" });
  res.json(offer);
}
export async function offerPdf(req, res) {
  const offer = await Offer.findById(req.params.id).populate("employee", "employeeId");
  if (!offer) return res.status(404).json({ message: "Offer not found" });

  const doc = new PDFDocument({ margin: 55 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="offer-${offer.candidateName.replace(/\s+/g, "-")}.pdf"`);
  doc.pipe(res);
  doc.fontSize(22).text("SCORECARE", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).text("LETTER OF OFFER", { align: "center" });
  doc.moveDown(2);
  doc.fontSize(11).text(`Date: ${new Date(offer.offerDate).toLocaleDateString("en-IN")}`);
  doc.moveDown();
  doc.text(`Dear ${offer.candidateName},`);
  doc.moveDown();
  doc.text(`We are pleased to offer you the position of ${offer.designation || "Team Member"} in the ${offer.department || "Organization"} department.`);
  doc.moveDown();
  doc.text(`Joining Date: ${offer.joiningDate ? new Date(offer.joiningDate).toLocaleDateString("en-IN") : "To be confirmed"}`);
  doc.text(`Employment Type: ${offer.employmentType || "-"}`);
  doc.text(`Annual CTC: ₹${Number(offer.salaryCTC || 0).toLocaleString("en-IN")}`);
  doc.text(`Probation: ${offer.probationPeriod || 0} months`);
  doc.text(`Work Location: ${offer.workLocation || "-"}`);
  doc.text(`Reporting Manager: ${offer.reportingManager || "-"}`);
  doc.moveDown(2);
  doc.text("We look forward to having you join our team.");
  doc.moveDown(3);
  doc.text("For Scorecare");
  doc.moveDown(2);
  doc.text("Authorized Signatory");
  doc.end();
}
