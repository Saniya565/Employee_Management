import {useEffect,useMemo,useState} from "react";
import {ArrowDownCircle,ArrowUpCircle,Plus,Trash2,Wallet,RefreshCw} from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import {useAuth} from "../context/AuthContext";

const today=()=>new Date().toISOString().slice(0,10);
export default function Finance(){
 const {user}=useAuth(); const [type,setType]=useState("Income"); const [heads,setHeads]=useState([]),[rows,setRows]=useState([]),[summary,setSummary]=useState({income:0,expenditure:0,balance:0}),[loading,setLoading]=useState(true);
 const [form,setForm]=useState({date:today(),amount:"",head:"",description:"",remarks:""}); const [newHead,setNewHead]=useState(""); const [showHead,setShowHead]=useState(false);
 const load=async()=>{setLoading(true);try{const [h,t,s]=await Promise.all([api.get("/finance/heads",{params:{type}}),api.get("/finance/transactions",{params:{type}}),api.get("/finance/summary")]);setHeads(h.data);setRows(t.data);setSummary(s.data);setForm(f=>({...f,head:h.data[0]?._id||""}));}finally{setLoading(false)}};
 useEffect(()=>{load()},[type]);
 const submit=async e=>{e.preventDefault();if(!form.head)return;await api.post("/finance/transactions",{...form,type,amount:Number(form.amount)});setForm(f=>({...f,amount:"",description:"",remarks:""}));load()};
 const addHead=async()=>{if(!newHead.trim())return;await api.post("/finance/heads",{name:newHead,type});setNewHead("");setShowHead(false);load()};
 const remove=async id=>{if(confirm("Delete this transaction?")){await api.delete(`/finance/transactions/${id}`);load()}};
 if(loading&&!rows.length)return <Loader/>;
 return <><PageHeader eyebrow="FINANCE" title="Income & Expenditure" subtitle="Track day-to-day business income and expenses." action={<button className="primary-btn" onClick={()=>setShowHead(true)}><Plus size={16}/> Add New Head</button>}/>
 <div className="finance-summary">
  <div className="finance-stat income"><ArrowUpCircle/><span>Total Income</span><b>₹{summary.income.toLocaleString("en-IN")}</b></div>
  <div className="finance-stat expense"><ArrowDownCircle/><span>Total Expenditure</span><b>₹{summary.expenditure.toLocaleString("en-IN")}</b></div>
  <div className="finance-stat balance"><Wallet/><span>Net Balance</span><b>₹{summary.balance.toLocaleString("en-IN")}</b></div>
 </div>
 <div className="panel finance-panel">
  <div className="finance-tabs"><button className={type==="Income"?"active":""} onClick={()=>setType("Income")}>Income</button><button className={type==="Expenditure"?"active":""} onClick={()=>setType("Expenditure")}>Expenditure</button><button className="refresh" onClick={load}><RefreshCw size={15}/></button></div>
  <form className="transaction-form" onSubmit={submit}>
   <label>Date<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/></label>
   <label>Amount (₹)<input type="number" min="0" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} required/></label>
   <label>Head<select value={form.head} onChange={e=>setForm({...form,head:e.target.value})} required><option value="">Select head</option>{heads.map(h=><option key={h._id} value={h._id}>{h.name}</option>)}</select></label>
   <label>Description<input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Transaction details"/></label>
   <label>Remarks<input value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})} placeholder="Notes / remarks"/></label>
   <button className="primary-btn" type="submit"><Plus size={15}/> Add Entry</button>
  </form>
  <div className="table-wrap"><table><thead><tr><th>Date</th><th>Head</th><th>Amount</th><th>Description</th><th>Remarks</th><th></th></tr></thead><tbody>
   {rows.length?rows.map(r=><tr key={r._id}><td>{new Date(r.date).toLocaleDateString("en-IN")}</td><td><b>{r.head?.name}</b></td><td className={r.type==="Income"?"money-in":"money-out"}>{r.type==="Income"?"+":"-"} ₹{Number(r.amount).toLocaleString("en-IN")}</td><td>{r.description||"—"}</td><td>{r.remarks||"—"}</td><td><button className="icon-btn danger-icon" onClick={()=>remove(r._id)} title="Delete"><Trash2 size={15}/></button></td></tr>):<tr><td colSpan="6"><div className="small-empty">No {type.toLowerCase()} entries yet.</div></td></tr>}
  </tbody></table></div>
 </div>
 {showHead&&<div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><span className="eyebrow">CUSTOM CATEGORY</span><h2>Add New {type} Head</h2></div><button className="icon-btn" onClick={()=>setShowHead(false)}>×</button></div><div className="modal-body"><label className="modal-label">Head name<input className="modal-input" value={newHead} onChange={e=>setNewHead(e.target.value)} placeholder={`e.g. ${type==="Income"?"Consulting Revenue":"Travel Expenses"}`} autoFocus/></label><div className="form-actions"><button className="secondary-btn" onClick={()=>setShowHead(false)}>Cancel</button><button className="primary-btn" onClick={addHead}>Create Head</button></div></div></div></div>}
 </>;
}
