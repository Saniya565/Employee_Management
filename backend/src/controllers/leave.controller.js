import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

function mailer(){
  if(!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host:process.env.SMTP_HOST, port:Number(process.env.SMTP_PORT||587),
    secure:String(process.env.SMTP_SECURE||"false")==="true",
    auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}
  });
}
async function sendMail(to,subject,text){
  const t=mailer(); if(!t || !to) return;
  await t.sendMail({from:process.env.MAIL_FROM||process.env.SMTP_USER,to,subject,text});
}
export async function listLeaves(req,res){
  const q={};
  if(req.user.role==="employee") {
    const emp=await Employee.findOne({email:req.user.email});
    if(emp) q.employee=emp._id; else q.employee=null;
  }
  if(req.query.status) q.status=req.query.status;
  res.json(await Leave.find(q).populate("employee","employeeId fullName email department").sort({createdAt:-1}));
}
export async function createLeave(req,res){
  const employee=await Employee.findOne({email:req.user.email});
  if(!employee) return res.status(400).json({message:"No employee profile is linked to this login"});
  const {fromDate,toDate,reason}=req.body;
  if(!fromDate||!toDate||!reason) return res.status(400).json({message:"From date, to date and reason are required"});
  const leave=await Leave.create({employee:employee._id,fromDate,toDate,reason});
  const approvers=await User.find({role:{$in:["admin","hr","employer"]}});
  for(const a of approvers) await sendMail(a.email,"New leave request - Scorecare",`${employee.fullName} requested leave from ${fromDate} to ${toDate}.\nReason: ${reason}`);
  res.status(201).json(await leave.populate("employee","employeeId fullName email department"));
}
export async function reviewLeave(req,res){
  const {status,reviewRemarks}=req.body;
  if(!["Approved","Rejected"].includes(status)) return res.status(400).json({message:"Status must be Approved or Rejected"});
  const leave=await Leave.findById(req.params.id).populate("employee","fullName email");
  if(!leave) return res.status(404).json({message:"Leave request not found"});
  leave.status=status; leave.reviewRemarks=reviewRemarks||""; leave.reviewer=req.user._id; leave.reviewedAt=new Date(); await leave.save();
  await sendMail(leave.employee.email,`Leave request ${status.toLowerCase()} - Scorecare`,`${leave.employee.fullName}, your leave request from ${new Date(leave.fromDate).toLocaleDateString("en-IN")} to ${new Date(leave.toDate).toLocaleDateString("en-IN")} was ${status.toLowerCase()}.${reviewRemarks?`\nRemarks: ${reviewRemarks}`:""}`);
  res.json(leave);
}
