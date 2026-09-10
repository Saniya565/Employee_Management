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
import Loader from "./components/Loader";
function Protected(){const{user,loading}=useAuth();if(loading)return <Loader/>;return user?<AppLayout/>:<Navigate to="/login" replace/>}
export default function App(){return <AuthProvider><BrowserRouter><Routes><Route path="/login" element={<Login/>}/><Route element={<Protected/>}><Route element={<AppLayout/>}><Route path="/" element={<Dashboard/>}/><Route path="/employees" element={<Employees/>}/><Route path="/employees/:id" element={<EmployeeProfile/>}/><Route path="/interns" element={<Interns/>}/><Route path="/offers" element={<Offers/>}/><Route path="/salary" element={<Salary/>}/><Route path="/documents" element={<Documents/>}/><Route path="/masters" element={<Masters/>}/></Route></Route></Routes></BrowserRouter></AuthProvider>}
