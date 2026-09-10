
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  Plus,
  Download,
  Trash2,
  FileText,
  WalletCards,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Loader from "../components/Loader";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

export default function EmployeeProfile() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [toast, setToast] = useState("");

  const load = () => {
    api
      .get(`/employees/${id}`)
      .then((r) => setData(r.data))
      .catch((err) => {
        console.error("Failed to load employee:", err);
      });
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!data) {
    return <Loader />;
  }

  const {
    employee: e,
    salaryHistory,
    documents,
    offers,
  } = data;

  const current = salaryHistory?.[0];

  // Add salary revision
  const saveSalary = async (ev) => {
    ev.preventDefault();

    try {
      const formData = new FormData(ev.target);
      const body = Object.fromEntries(formData.entries());

      await api.post(`/employees/${id}/salary`, body);

      setSalaryOpen(false);
      setToast("Salary record added");
      load();
    } catch (err) {
      console.error("Failed to add salary:", err);
      setToast("Failed to add salary record");
    }
  };

  // Upload employee document
  const upload = async (ev) => {
    ev.preventDefault();

    try {
      const formData = new FormData(ev.target);

      await api.post(`/employees/${id}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDocOpen(false);
      setToast("Document uploaded");
      load();
    } catch (err) {
      console.error("Failed to upload document:", err);
      setToast("Failed to upload document");
    }
  };

  // Delete document
  const deleteDocument = async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);

      setToast("Document deleted");
      load();
    } catch (err) {
      console.error("Failed to delete document:", err);
      setToast("Failed to delete document");
    }
  };

  return (
    <>
      {/* Back button */}
      <button
        className="back-link"
        onClick={() => nav("/employees")}
      >
        <ArrowLeft size={16} />
        Back to employees
      </button>

      {/* Employee Hero */}
      <div className="profile-hero panel">
        <div className="profile-avatar">
          {e.fullName?.[0]}
        </div>

        <div className="profile-main">
          <div className="profile-name">
            <div>
              <div className="eyebrow">
                EMPLOYEE PROFILE · {e.employeeId}
              </div>

              <h1>{e.fullName}</h1>

              <p>
                {e.designation} · {e.department}
              </p>
            </div>

            <Badge>{e.employmentStatus}</Badge>
          </div>

          <div className="contact-row">
            <span>
              <Mail size={15} />
              {e.email}
            </span>

            <span>
              <Phone size={15} />
              {e.phone}
            </span>

            <span>
              <MapPin size={15} />
              {e.workLocation || "Location not set"}
            </span>

            <span>
              <CalendarDays size={15} />
              Joined{" "}
              {e.dateOfJoining
                ? new Date(e.dateOfJoining).toLocaleDateString("en-IN")
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Employment Lifecycle */}
      <div className="lifecycle panel">
        <div className="panel-head">
          <div>
            <h3>Employment lifecycle</h3>
            <p>Current position in the employee journey</p>
          </div>
        </div>

        <div className="lifecycle-line">
          {[
            "Offer Generated",
            "Offer Accepted",
            "Joined",
            "Probation",
            "Confirmed",
            "Relieved",
          ].map((step, index) => (
            <div
              className={`life-step ${index <= 3 ? "done" : ""}`}
              key={step}
            >
              <span>{index <= 3 ? "✓" : index + 1}</span>
              <b>{step}</b>
            </div>
          ))}
        </div>
      </div>

      {/* Personal + Professional Information */}
      <div className="profile-grid">
        {/* Personal Information */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>
                <UserRound />
                Personal information
              </h3>
            </div>
          </div>

          <InfoGrid
            items={[
              ["Email", e.email],
              ["Phone", e.phone],
              [
                "Date of birth",
                e.dateOfBirth
                  ? new Date(e.dateOfBirth).toLocaleDateString("en-IN")
                  : "—",
              ],
              ["Gender", e.gender || "—"],
              ["Address", e.address || "—"],
              [
                "Emergency contact",
                e.emergencyContact || "—",
              ],
            ]}
          />
        </section>

        {/* Professional Information */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>
                <BriefcaseBusiness />
                Professional information
              </h3>
            </div>
          </div>

          <InfoGrid
            items={[
              ["Department", e.department || "—"],
              ["Designation", e.designation || "—"],
              ["Employment type", e.employmentType || "—"],
              [
                "Reporting manager",
                e.reportingManager || "—",
              ],
              [
                "Work location",
                e.workLocation || "—",
              ],
              [
                "Probation end",
                e.probationEndDate
                  ? new Date(
                      e.probationEndDate
                    ).toLocaleDateString("en-IN")
                  : "—",
              ],
            ]}
          />
        </section>
      </div>

      {/* Salary Information */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>
              <WalletCards />
              Salary information
            </h3>

            <p>Current salary and revision history</p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setSalaryOpen(true)}
          >
            <Plus size={16} />
            Add revision
          </button>
        </div>

        {/* Current Salary Highlight */}
        {current && (
          <div className="salary-highlight">
            <div>
              <span>Current CTC</span>
              <b>
                ₹
                {Number(current.ctc).toLocaleString("en-IN")}
              </b>
            </div>

            <div>
              <span>Gross / month</span>
              <b>
                ₹
                {Number(
                  current.grossSalary
                ).toLocaleString("en-IN")}
              </b>
            </div>

            <div>
              <span>Net / month</span>
              <b>
                ₹
                {Number(
                  current.netSalary
                ).toLocaleString("en-IN")}
              </b>
            </div>
          </div>
        )}

        {/* Salary History */}
        {salaryHistory?.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Effective date</th>
                  <th>Previous CTC</th>
                  <th>New CTC</th>
                  <th>Gross</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {salaryHistory.map((salary, index) => (
                  <tr key={salary._id}>
                    <td>
                      {salary.effectiveFrom
                        ? new Date(
                            salary.effectiveFrom
                          ).toLocaleDateString("en-IN")
                        : "—"}
                    </td>

                    <td>
                      {index <
                      salaryHistory.length - 1
                        ? `₹${Number(
                            salaryHistory[index + 1].ctc
                          ).toLocaleString("en-IN")}`
                        : "—"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        salary.ctc
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      ₹
                      {Number(
                        salary.grossSalary
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>{salary.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyMini text="No salary records yet." />
        )}
      </section>

      {/* Documents */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>
              <FileText />
              Documents
            </h3>

            <p>
              Employment records and supporting files
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={() => setDocOpen(true)}
          >
            <Plus size={16} />
            Upload document
          </button>
        </div>

        {documents?.length ? (
          <div className="doc-list">
            {documents.map((document) => (
              <div
                className="doc-item"
                key={document._id}
              >
                <div className="doc-icon">
                  <FileText size={19} />
                </div>

                <div>
                  <b>{document.documentName}</b>

                  <small>
                    {document.documentType} ·{" "}
                    {document.uploadDate
                      ? new Date(
                          document.uploadDate
                        ).toLocaleDateString("en-IN")
                      : "—"}
                  </small>
                </div>

                <div className="doc-actions">
                  <Badge>{document.status}</Badge>

                  <a
                    href={`${
                      import.meta.env.VITE_API_URL?.replace(
                        "/api",
                        ""
                      ) || "http://localhost:5000"
                    }/${document.filePath?.replaceAll(
                      "\\",
                      "/"
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download size={16} />
                  </a>

                  <button
                    onClick={() =>
                      deleteDocument(document._id)
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyMini text="No documents uploaded yet." />
        )}
      </section>

      {/* Offer History */}
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>
              <FileText />
              Offer history
            </h3>
          </div>
        </div>

        {offers?.length ? (
          offers.map((offer) => (
            <div
              className="history-row"
              key={offer._id}
            >
              <div>
                <b>{offer.candidateName}</b>

                <small>
                  {offer.designation} ·{" "}
                  {offer.offerDate
                    ? new Date(
                        offer.offerDate
                      ).toLocaleDateString("en-IN")
                    : "—"}
                </small>
              </div>

              <Badge>{offer.status}</Badge>
            </div>
          ))
        ) : (
          <EmptyMini text="No offer letters linked to this employee." />
        )}
      </section>

      {/* Salary Revision Modal */}
      <Modal
        open={salaryOpen}
        onClose={() => setSalaryOpen(false)}
        title="Add salary revision"
      >
        <form
          className="form-grid"
          onSubmit={saveSalary}
        >
          <label>
            Basic salary
            <input
              name="basicSalary"
              type="number"
              required
            />
          </label>

          <label>
            HRA
            <input
              name="hra"
              type="number"
            />
          </label>

          <label>
            Allowances
            <input
              name="allowances"
              type="number"
            />
          </label>

          <label>
            Deductions
            <input
              name="deductions"
              type="number"
            />
          </label>

          <label>
            Bonus
            <input
              name="bonus"
              type="number"
            />
          </label>

          <label>
            CTC
            <input
              name="ctc"
              type="number"
              required
            />
          </label>

          <label>
            Effective from
            <input
              name="effectiveFrom"
              type="date"
              required
            />
          </label>

          <label>
            Revision date
            <input
              name="salaryRevisionDate"
              type="date"
            />
          </label>

          <label className="form-span">
            Reason
            <input
              name="reason"
              placeholder="Annual revision"
            />
          </label>

          <div className="form-actions form-span">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setSalaryOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Save revision
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        open={docOpen}
        onClose={() => setDocOpen(false)}
        title="Upload employee document"
      >
        <form
          className="form-grid"
          onSubmit={upload}
        >
          <label>
            Document name
            <input
              name="documentName"
              placeholder="Offer Letter"
              required
            />
          </label>

          <label>
            Document type
            <select name="documentType">
              {[
                "Offer Letter",
                "Joining Letter",
                "Experience Certificate",
                "Relieving Letter",
                "Salary Slip",
                "ID Proof",
                "Address Proof",
                "Educational Certificate",
                "Other",
              ].map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="form-span file-input">
            File
            <input
              name="file"
              type="file"
              required
            />
          </label>

          <div className="form-actions form-span">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setDocOpen(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Upload
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      <Toast
        message={toast}
        onClose={() => setToast("")}
      />
    </>
  );
}

// Information Grid
function InfoGrid({ items }) {
  return (
    <div className="info-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <b>{value || "—"}</b>
        </div>
      ))}
    </div>
  );
}

// Empty State
function EmptyMini({ text }) {
  return (
    <div className="small-empty">
      {text}
    </div>
  );
}
