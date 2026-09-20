import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, GraduationCap, FileText, WalletCards, FolderOpen, Settings2, Menu, Bell, Search, LogOut, X, Wallet, CalendarCheck, ClipboardCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import logo from "../assets/scorecare-logo.JPEG";

const employerNav = [
  ["Dashboard", "/", LayoutDashboard], ["Employees", "/employees", Users], ["Interns", "/interns", GraduationCap],
  ["Offers", "/offers", FileText], ["Salary", "/salary", WalletCards], ["Documents", "/documents", FolderOpen],
  ["Finance", "/finance", Wallet], ["Attendance", "/attendance", CalendarCheck], ["Leave & Approvals", "/leaves", ClipboardCheck],
  ["Masters", "/masters", Settings2],
];
const employeeNav = [
  ["Dashboard", "/", LayoutDashboard], ["Attendance", "/attendance", CalendarCheck], ["Leave Requests", "/leaves", ClipboardCheck],
];

export default function AppLayout() {
  const { user, logout } = useAuth(), loc = useLocation();
  const nav = ["admin","hr","employer"].includes(user?.role) ? employerNav : employeeNav;
  const [open, setOpen] = useState(false);
  const current = nav.find(n => n[1] === loc.pathname)?.[0] || "Employee Profile";
  return <div className="app-shell">
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
  <img className="brand-logo" src={logo} alt="Scorecare logo"/>
  <b>scorecare</b>

  <button className="mobile-close" onClick={() => setOpen(false)}>
    <X/>
  </button>
</div>
      <div className="workspace"><span className="workspace-dot"/><div><b>HR Workspace</b><small>Operations</small></div></div>
      <nav>{nav.map(([name, path, Icon]) => <NavLink key={path} to={path} end={path === "/"} onClick={() => setOpen(false)}><Icon size={18}/><span>{name}</span></NavLink>)}</nav>
      <div className="sidebar-bottom">
        <div className="mini-help"><span>Need help?</span><b>Open support center →</b></div>
        <button className="logout-btn" onClick={logout}><LogOut size={17}/> Sign out</button>
      </div>
    </aside>
    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setOpen(true)}><Menu/></button>
        <div className="crumb"><span>Workspace</span><b>/</b><strong>{current}</strong></div>
        <div className="top-actions"><button className="top-icon"><Search size={18}/></button><button className="top-icon bell"><Bell size={18}/><i/></button><div className="user-menu"><div className="avatar">{user?.name?.slice(0,1) || "A"}</div><div><b>{user?.name || "Admin"}</b><span>{user?.role || "admin"}</span></div></div></div>
      </header>
      <div className="page"><Outlet/></div>
    </main>
  </div>;
}
