import { useEffect, useState } from "react";
import api from "../services/api";
const blank={loginPassword:"",employeeId:"",fullName:"",email:"",phone:"",dateOfBirth:"",gender:"Prefer not to say",address:"",department:"Technology",designation:"Software Developer",employmentType:"Full-time",dateOfJoining:new Date().toISOString().slice(0,10),reportingManager:"",workLocation:"",employmentStatus:"Active",probationPeriod:3,probationEndDate:"",emergencyContact:"",bankDetails:"",panDetails:"",notes:""};
export default function EmployeeForm({ initial, onSaved, onCancel }) {
  const [form,setForm]=useState({...blank,...initial, dateOfBirth: initial?.dateOfBirth?.slice(0,10)||"",dateOfJoining:initial?.dateOfJoining?.slice(0,10)||blank.dateOfJoining,probationEndDate:initial?.probationEndDate?.slice(0,10)||""});
  const [departments,setDepartments]=useState([]),[designations,setDesignations]=useState([]),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  useEffect(()=>{Promise.all([api.get("/departments"),api.get("/designations")]).then(([a,b])=>{setDepartments(a.data);setDesignations(b.data)})},[]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const submit=async e=>{e.preventDefault();setError("");setBusy(true);try{const r=initial?await api.put(`/employees/${initial._id}`,form):await api.post("/employees",form);onSaved(r.data)}catch(err){setError(err.response?.data?.message||"Unable to save employee")}finally{setBusy(false)}};
  return <form className="form-grid" onSubmit={submit}>
    {error&&<div className="form-error form-span">{error}</div>}
    <div className="section-title form-span">Personal information</div>
    <label>Employee ID *<input value={form.employeeId} onChange={e=>set("employeeId",e.target.value)} placeholder="EMP-001" required/></label>
    <label>Full name *<input value={form.fullName} onChange={e=>set("fullName",e.target.value)} placeholder="Full name" required/></label>
    <label>Email *<input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="name@company.com" required/></label>
    <label>Employee login password<input type="password" value={form.loginPassword||""} onChange={e=>set("loginPassword",e.target.value)} placeholder={initial?"Leave blank to keep current":"Set employee login password"}/></label>
    <label>Phone *<input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91 98765 43210" pattern="[0-9+ ()-]{10,}" required/></label>
    <label>Date of birth<input type="date" value={form.dateOfBirth} onChange={e=>set("dateOfBirth",e.target.value)}/></label>
    <label>Gender<select value={form.gender} onChange={e=>set("gender",e.target.value)}>{["Male","Female","Other","Prefer not to say"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="form-span">Address<textarea value={form.address} onChange={e=>set("address",e.target.value)} placeholder="Residential address"/></label>
    <div className="section-title form-span">Professional information</div>
    <label>Department<select value={form.department} onChange={e=>set("department",e.target.value)}>{departments.length?departments.map(x=><option key={x._id}>{x.name}</option>):<option>Technology</option>}</select></label>
    <label>Designation<select value={form.designation} onChange={e=>set("designation",e.target.value)}>{designations.length?designations.map(x=><option key={x._id}>{x.name}</option>):<option>Software Developer</option>}</select></label>
    <label>Employment type<select value={form.employmentType} onChange={e=>set("employmentType",e.target.value)}>{["Full-time","Part-time","Contract","Intern"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Joining date *<input type="date" value={form.dateOfJoining} onChange={e=>set("dateOfJoining",e.target.value)} required/></label>
    <label>Reporting manager<input value={form.reportingManager} onChange={e=>set("reportingManager",e.target.value)} placeholder="Manager name"/></label>
    <label>Work location<input value={form.workLocation} onChange={e=>set("workLocation",e.target.value)} placeholder="Noida / Remote"/></label>
    <label>Status<select value={form.employmentStatus} onChange={e=>set("employmentStatus",e.target.value)}>{["Active","Inactive","Resigned","Terminated","Relieved"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Probation (months)<input type="number" min="0" value={form.probationPeriod} onChange={e=>set("probationPeriod",e.target.value)}/></label>
    <label>Probation end date<input type="date" value={form.probationEndDate} onChange={e=>set("probationEndDate",e.target.value)}/></label>
    <div className="section-title form-span">Sensitive / additional information</div>
    <label>Emergency contact<input value={form.emergencyContact} onChange={e=>set("emergencyContact",e.target.value)} placeholder="Name + phone"/></label>
    <label>Bank details<input value={form.bankDetails} onChange={e=>set("bankDetails",e.target.value)} placeholder="Account / IFSC"/></label>
    <label>PAN / Tax details<input value={form.panDetails} onChange={e=>set("panDetails",e.target.value)} placeholder="PAN"/></label>
    <label className="form-span">Notes<textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Internal HR notes"/></label>
    <div className="form-actions form-span"><button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button><button className="primary-btn" disabled={busy}>{busy?"Saving…":initial?"Save changes":"Create employee"}</button></div>
  </form>;
}
