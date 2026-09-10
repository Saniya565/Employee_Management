import { useEffect, useState } from "react";
import { Plus, Search, SlidersHorizontal, MoreHorizontal, Pencil, Trash2, Eye, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import EmployeeForm from "../components/EmployeeForm";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";

export default function Employees(){
 const [data,setData]=useState(null),[q,setQ]=useState(""),[department,setDepartment]=useState(""),[status,setStatus]=useState(""),[showForm,setShowForm]=useState(false),[edit,setEdit]=useState(null),[departments,setDepartments]=useState([]),[toast,setToast]=useState(""),[searchParams]=useSearchParams(),nav=useNavigate();
 const load=()=>api.get("/employees",{params:{search:q,department,status,limit:50}}).then(r=>setData(r.data));
 useEffect(()=>{api.get("/departments").then(r=>setDepartments(r.data)); if(searchParams.get("new"))setShowForm(true)},[]);
 useEffect(()=>{const t=setTimeout(load,250);return()=>clearTimeout(t)},[q,department,status]);
 const del=async id=>{if(!confirm("Delete this employee and related HR records?"))return;await api.delete(`/employees/${id}`);setToast("Employee deleted");load()};
 if(!data)return <Loader/>;
 return <><PageHeader eyebrow="PEOPLE" title="Employees" subtitle="Manage your workforce from onboarding to exit." action={<button className="primary-btn" onClick={()=>{setEdit(null);setShowForm(true)}}><Plus size={17}/> Add employee</button>}/>
 <div className="toolbar panel"><div className="search-box"><Search size={17}/><input placeholder="Search name, ID or email…" value={q} onChange={e=>setQ(e.target.value)}/></div><div className="filters"><select value={department} onChange={e=>setDepartment(e.target.value)}><option value="">All departments</option>{departments.map(d=><option key={d._id}>{d.name}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All status</option>{["Active","Inactive","Resigned","Terminated","Relieved"].map(x=><option key={x}>{x}</option>)}</select><button className="secondary-btn"><SlidersHorizontal size={16}/> Filters</button></div></div>
 <div className="panel table-panel"><div className="panel-head"><div><h3>Employee directory</h3><p>{data.total} record{data.total!==1?"s":""} found</p></div><span className="soft-chip"><Users size={14}/> {data.total} people</span></div>
 {data.items.length?<div className="table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Designation</th><th>Joining date</th><th>Type</th><th>Status</th><th></th></tr></thead><tbody>{data.items.map(e=><tr key={e._id}><td><div className="person"><div className="table-avatar">{e.fullName?.[0]}</div><div><b>{e.fullName}</b><small>{e.employeeId} · {e.email}</small></div></div></td><td>{e.department}</td><td>{e.designation}</td><td>{new Date(e.dateOfJoining).toLocaleDateString("en-IN")}</td><td>{e.employmentType}</td><td><Badge>{e.employmentStatus}</Badge></td><td><div className="row-actions"><button title="View" onClick={()=>nav(`/employees/${e._id}`)}><Eye size={16}/></button><button title="Edit" onClick={()=>{setEdit(e);setShowForm(true)}}><Pencil size={16}/></button><button className="danger-icon" title="Delete" onClick={()=>del(e._id)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>:<EmptyState title="No employees found"/>}</div>
 <Modal open={showForm} onClose={()=>setShowForm(false)} title={edit?"Edit employee":"Add new employee"} wide><EmployeeForm initial={edit} onCancel={()=>setShowForm(false)} onSaved={()=>{setShowForm(false);setToast(edit?"Employee updated":"Employee created");load()}}/></Modal>
 <Toast message={toast} onClose={()=>setToast("")}/></>;
}
