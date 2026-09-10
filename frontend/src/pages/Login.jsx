import { useState } from "react";
import { ShieldCheck, ArrowRight, Eye, EyeOff, UsersRound, BarChart3, FileCheck2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth(), nav = useNavigate();
  const [email, setEmail] = useState("admin@scorecare.com"), [password, setPassword] = useState("Admin@123"), [show, setShow] = useState(false), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const submit = async e => { e.preventDefault(); setError(""); setBusy(true); try { await login(email, password); nav("/"); } catch (err) { setError(err.response?.data?.message || "Login failed"); } finally { setBusy(false); } };
  return <div className="login-page">
    <div className="login-visual">
      <div className="login-logo"><div className="brand-mark">S</div><b>scorecare</b></div>
      <div className="visual-content"><span className="pill"><span/> People operations, simplified</span><h1>Build a better<br/><em>workplace.</em></h1><p>One calm workspace for your people, documents, offers and payroll records.</p>
        <div className="feature-list"><div><UsersRound/><span><b>People-first records</b><small>Employees & interns in one place</small></span></div><div><BarChart3/><span><b>Real-time insights</b><small>See workforce health at a glance</small></span></div><div><FileCheck2/><span><b>Organized documents</b><small>Secure employment records</small></span></div></div>
      </div><div className="visual-foot">© 2026 Scorecare Technologies</div>
    </div>
    <div className="login-panel"><div className="login-card"><div className="mobile-login-mark">S</div><div className="eyebrow">ADMIN PORTAL</div><h2>Welcome back</h2><p>Sign in to continue to your HR workspace.</p>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submit}><label>Work email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@company.com" required/></label>
      <label>Password<div className="password-field"><input value={password} onChange={e=>setPassword(e.target.value)} type={show?"text":"password"} required/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
      <div className="login-row"><label className="check"><input type="checkbox" defaultChecked/> Remember me</label><a href="#forgot">Forgot password?</a></div>
      <button className="primary-btn full" disabled={busy}>{busy?"Signing in…":"Sign in"} {!busy && <ArrowRight size={18}/>}</button></form>
      <div className="secure-note"><ShieldCheck size={16}/> Protected with JWT authentication</div>
    </div></div>
  </div>;
}
