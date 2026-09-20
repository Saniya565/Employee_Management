import {useEffect,useState} from "react";
import {CalendarCheck,CheckCircle2} from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import {useAuth} from "../context/AuthContext";
export default function Attendance(){
 const {user}=useAuth(); const employer=["admin","hr","employer"].includes(user?.role); const [employees,setEmployees]=useState([]),[rows,setRows]=useState([]),[date,setDate]=useState(new Date().toISOString().slice(0,10)),[loading,setLoading]=useState(true);
 const [form,setForm]=useState({employee:"",status:"Present",remarks:""});
 const load=async()=>{setLoading(true);try{const a=await api.get("/attendance",{params:{date}});setRows(a.data);if(employer){const e=await api.get("/employees",{params:{limit:100}});setEmployees(e.data.items)}}finally{setLoading(false)}};
 useEffect(()=>{load()},[date]);
 useEffect(()=>{if(user?.role==="employee" && user.email)api.get("/attendance",{params:{date}}).then(r=>setRows(r.data))},[date,user]);
 const mark=async e=>{e.preventDefault();await api.post("/attendance",{...form,date});setForm(f=>({...f,remarks:""}));load()};
 if(loading)return <Loader/>;
 return <><PageHeader eyebrow="PEOPLE" title="Attendance" subtitle="Log daily presence and attendance status." action={<div className="date-control"><CalendarCheck size={16}/><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>}/>
 {employer&&<div className="panel attendance-form"><div className="panel-head"><div><h3>Mark attendance</h3><p>Update an employee's status for {new Date(date).toLocaleDateString("en-IN")}</p></div></div><form className="transaction-form" onSubmit={mark}><label>Employee<select value={form.employee} onChange={e=>setForm({...form,employee:e.target.value})} required><option value="">Select employee</option>{employees.map(e=><option key={e._id} value={e._id}>{e.fullName} ({e.employeeId})</option>)}</select></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>Present</option><option>Absent</option><option>Half Day</option><option>Leave</option><option>Holiday</option></select></label><label>Remarks<input value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})}/></label><button className="primary-btn"><CheckCircle2 size={15}/> Save Attendance</button></form></div>}
 <div className="panel"><div className="panel-head"><div><h3>{employer?"Daily attendance":"My attendance"}</h3><p>{rows.length} record(s)</p></div></div><div className="table-wrap"><table><thead><tr><th>Employee</th><th>Date</th><th>Status</th><th>Remarks</th></tr></thead><tbody>{rows.length?rows.map(r=><tr key={r._id}><td><b>{r.employee?.fullName}</b><small>{r.employee?.employeeId}</small></td><td>{new Date(r.date).toLocaleDateString("en-IN")}</td><td><span className={`badge badge-${r.status.toLowerCase().replace(" ","-")}`}>{r.status}</span></td><td>{r.remarks||"—"}</td></tr>):<tr><td colSpan="4"><div className="small-empty">No attendance recorded for this date.</div></td></tr>}</tbody></table></div></div></>;
}
