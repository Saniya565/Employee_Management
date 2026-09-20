import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
export async function listAttendance(req,res){
  const {date,employee,status}=req.query; const q={};
  if(date){const d=new Date(date); const end=new Date(d); end.setDate(end.getDate()+1); q.date={$gte:d,$lt:end};}
  if(employee) q.employee=employee;
  if(status) q.status=status;
  if(req.user.role==="employee"){ const emp=await Employee.findOne({email:req.user.email}); q.employee=emp?._id || null; }
  res.json(await Attendance.find(q).populate("employee","employeeId fullName department").sort({date:-1}));
}
export async function markAttendance(req,res){
  const {employee,date,status,remarks}=req.body;
  if(!employee||!date||!status) return res.status(400).json({message:"Employee, date and status are required"});
  if(!(await Employee.exists({_id:employee}))) return res.status(404).json({message:"Employee not found"});
  const item=await Attendance.findOneAndUpdate({employee,date},{employee,date,status,remarks,markedBy:req.user._id},{new:true,upsert:true,setDefaultsOnInsert:true}).populate("employee","employeeId fullName department");
  res.json(item);
}
