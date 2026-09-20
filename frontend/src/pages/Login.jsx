
import { useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  UsersRound,
  BarChart3,
  FileCheck2,
  BriefcaseBusiness,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/scorecare-logo.JPEG";

export default function Login({ role = "employer" }) {
  const { login } = useAuth();
  const nav = useNavigate();

  // Get default login credentials from .env
  const defaultEmail =
    role === "employee"
      ? import.meta.env.VITE_EMPLOYEE_EMAIL
      : import.meta.env.VITE_EMPLOYER_EMAIL;

  const defaultPassword =
    role === "employee"
      ? import.meta.env.VITE_EMPLOYEE_PASSWORD
      : import.meta.env.VITE_EMPLOYER_PASSWORD;

  const [email, setEmail] = useState(defaultEmail || "");
  const [password, setPassword] = useState(defaultPassword || "");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      await login(email, password, role);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-visual">
        <div className="login-logo">
          <div className="brand-mark">
            <img src={logo} alt="ScoreCare Logo" />
          </div>

          <b>scorecare</b>
        </div>

        <div className="visual-content">
          <span className="pill">
            <span />
            People operations, simplified
          </span>

          <h1>
            Build a better
            <br />
            <em>workplace.</em>
          </h1>

          <p>
            One calm workspace for your people, attendance, leave, finance and
            employment records.
          </p>

          <div className="feature-list">
            <div>
              <UsersRound />

              <span>
                <b>People-first records</b>
                <small>Employees & interns in one place</small>
              </span>
            </div>

            <div>
              <BarChart3 />

              <span>
                <b>Real-time insights</b>
                <small>Workforce and finance at a glance</small>
              </span>
            </div>

            <div>
              <FileCheck2 />

              <span>
                <b>Organized workflows</b>
                <small>Leave, attendance and documents</small>
              </span>
            </div>
          </div>
        </div>

        <div className="visual-foot">
          © 2026 Scorecare Technologies
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-panel">
        <div className="login-card">
          <div className="mobile-login-mark">S</div>

          <div className="eyebrow">
            {role === "employee" ? "EMPLOYEE" : "EMPLOYER"} PORTAL
          </div>

          <h2>
            {role === "employee" ? "Employee Login" : "Employer Login"}
          </h2>

          <p>Sign in to continue to your HR workspace.</p>

          {/* ROLE SWITCH */}
          <div className="role-switch">
            <button
              type="button"
              className={role === "employer" ? "active" : ""}
              onClick={() => nav("/employer/login")}
            >
              <BriefcaseBusiness size={14} />
              Employer
            </button>

            <button
              type="button"
              className={role === "employee" ? "active" : ""}
              onClick={() => nav("/employee/login")}
            >
              <UsersRound size={14} />
              Employee
            </button>
          </div>

          {/* ERROR */}
          {error && <div className="form-error">{error}</div>}

          {/* LOGIN FORM */}
          <form onSubmit={submit}>
            {/* EMAIL */}
            <label>
              Work email

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </label>

            {/* PASSWORD */}
            <label>
              Password

              <div className="password-field">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {/* REMEMBER + FORGOT */}
            <div className="login-row">
              <label className="check">
                <input type="checkbox" defaultChecked />
                Remember me
              </label>

              <a href="#forgot">Forgot password?</a>
            </div>

            {/* LOGIN BUTTON */}
            <button
              className="primary-btn full"
              disabled={busy}
              type="submit"
            >
              {busy ? "Signing in…" : "Sign in"}

              {!busy && <ArrowRight size={18} />}
            </button>
          </form>

          {/* SECURITY NOTE */}
          <div className="secure-note">
            <ShieldCheck size={16} />
            Protected with JWT authentication
          </div>
          </div>
          </div>
          </div>
  );}

