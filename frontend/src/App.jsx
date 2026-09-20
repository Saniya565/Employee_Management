import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import {AuthProvider,useAuth} from "./context/AuthContext";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeProfile from "./pages/EmployeeProfile";
import Interns from "./pages/Interns";
import Offers from "./pages/Offers";
import Salary from "./pages/Salary";
import Documents from "./pages/Documents";
import Masters from "./pages/Masters";
import Finance from "./pages/Finance";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Loader from "./components/Loader";
function Protected(){const{user,loading}=useAuth();if(loading)return <Loader/>;return user?<AppLayout/>:<Navigate to="/employer/login" replace/>}
function EmployerOnly({children}){const{user}=useAuth();return ["admin","hr","employer"].includes(user?.role)?children:<Navigate to="/attendance" replace/>}
export default function App(){return <AuthProvider><BrowserRouter><Routes><Route path="/login" element={<Navigate to="/employer/login" replace/>}/><Route path="/employer/login" element={<Login role="employer"/>}/><Route path="/employee/login" element={<Login role="employee"/>}/><Route element={<Protected/>}><Route path="/" element={<Dashboard/>}/><Route path="/employees" element={<EmployerOnly><Employees/></EmployerOnly>}/><Route path="/employees/:id" element={<EmployerOnly><EmployeeProfile/></EmployerOnly>}/><Route path="/interns" element={<EmployerOnly><Interns/></EmployerOnly>}/><Route path="/offers" element={<EmployerOnly><Offers/></EmployerOnly>}/><Route path="/salary" element={<EmployerOnly><Salary/></EmployerOnly>}/><Route path="/documents" element={<EmployerOnly><Documents/></EmployerOnly>}/><Route path="/masters" element={<EmployerOnly><Masters/></EmployerOnly>}/><Route path="/finance" element={<EmployerOnly><Finance/></EmployerOnly>}/><Route path="/attendance" element={<Attendance/>}/><Route path="/leaves" element={<Leaves/>}/></Route></Routes></BrowserRouter></AuthProvider>}
