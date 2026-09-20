import {useEffect,useState} from "react";
import {Check,Clock3,Plus,X} from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import {useAuth} from "../context/AuthContext";
export default function Leaves(){
 const {user}=useAuth(); const employer=["admin","hr","employer"].includes(user?.role); const [rows,setRows]=useState([]),[loading,setLoading]=useState(true),[open,setOpen]=useState(false);
 const [form,setForm]=useState({fromDate:"",toDate:"",reason:""}),[remarks,setRemarks]=useState("");
 const load=()=>{setLoading(true);api.get("/leaves").then(r=>setRows(r.data)).finally(()=>setLoading(false))}; useEffect(load,[]);
 const submit=async e=>{e.preventDefault();await api.post("/leaves",form);setOpen(false);setForm({fromDate:"",toDate:"",reason:""});load()};
 const review=async(id,status)=>{await api.put(`/leaves/${id}/review`,{status,reviewRemarks:remarks});setRemarks("");load()};
 if(loading)return <Loader/>;
 return <><PageHeader eyebrow="PEOPLE" title="Leave & Approvals" subtitle={employer?"Review employee leave requests and approval status.":"Submit leave requests and track approval status."} action={!employer&&<button className="primary-btn" onClick={()=>setOpen(true)}><Plus size={16}/> Request Leave</button>}/>
 <div className="panel"><div className="panel-head"><div><h3>{employer?"Leave requests":"My leave requests"}</h3><p>Email notifications are sent on submission and review when SMTP is configured.</p></div></div><div className="table-wrap"><table><thead><tr><th>Employee</th><th>From</th><th>To</th><th>Reason</th><th>Status</th>{employer&&<th>Action</th>}</tr></thead><tbody>{rows.length?rows.map(r=><tr key={r._id}><td><b>{r.employee?.fullName}</b><small>{r.employee?.email}</small></td><td>{new Date(r.fromDate).toLocaleDateString("en-IN")}</td><td>{new Date(r.toDate).toLocaleDateString("en-IN")}</td><td>{r.reason}</td><td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>{employer&&<td>{r.status==="Pending"?<div className="row-actions"><button className="approve-btn" onClick={()=>review(r._id,"Approved")}><Check size={15}/> Approve</button><button className="reject-btn" onClick={()=>review(r._id,"Rejected")}><X size={15}/> Reject</button></div>:<span className="muted">{r.reviewRemarks||"Reviewed"}</span>}</td>}</tr>):<tr><td colSpan={employer?6:5}><div className="small-empty">No leave requests found.</div></td></tr>}</tbody></table></div></div>
 {open&&<div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><span className="eyebrow">TIME OFF</span><h2>Request Leave</h2></div><button className="icon-btn" onClick={()=>setOpen(false)}>×</button></div><form className="modal-body form-grid" onSubmit={submit}><label>From date<input type="date" value={form.fromDate} onChange={e=>setForm({...form,fromDate:e.target.value})} required/></label><label>To date<input type="date" value={form.toDate} onChange={e=>setForm({...form,toDate:e.target.value})} required/></label><label className="form-span">Reason<textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} placeholder="Reason for leave" required/></label><div className="form-actions form-span"><button type="button" className="secondary-btn" onClick={()=>setOpen(false)}>Cancel</button><button className="primary-btn">Submit Request</button></div></form></div></div>}
 </>;
}
