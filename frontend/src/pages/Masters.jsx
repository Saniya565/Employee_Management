import { useEffect, useState } from "react";
import {
  Building2,
  BriefcaseBusiness,
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
  CheckCircle2,
  X,
} from "lucide-react";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

export default function Masters() {
  const [activeTab, setActiveTab] = useState("departments");

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState("");

  // ----------------------------------------------------
  // LOAD DATA
  // ----------------------------------------------------

  const loadDepartments = async () => {
    try {
      const response = await api.get("/departments");

      setDepartments(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Department loading error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load departments."
      );
    }
  };

  const loadDesignations = async () => {
    try {
      const response = await api.get("/designations");

      setDesignations(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error("Designation loading error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load designations."
      );
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    if (activeTab === "departments") {
      await loadDepartments();
    } else {
      await loadDesignations();
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // ----------------------------------------------------
  // CURRENT ITEMS
  // ----------------------------------------------------

  const currentItems =
    activeTab === "departments"
      ? departments
      : designations;

  const filteredItems = currentItems.filter((item) => {
    const text =
      `${item.name || ""} ${
        item.description || ""
      } ${item.department || ""}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  // ----------------------------------------------------
  // OPEN ADD MODAL
  // ----------------------------------------------------

  const openAddModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  // ----------------------------------------------------
  // OPEN EDIT MODAL
  // ----------------------------------------------------

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  // ----------------------------------------------------
  // SAVE
  // ----------------------------------------------------

  const handleSave = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const body = {
      name: formData.get("name")?.trim(),
    };

    if (activeTab === "departments") {
      body.description =
        formData.get("description")?.trim() || "";
    }

    if (activeTab === "designations") {
      body.department =
        formData.get("department")?.trim() || "";
    }

    try {
      if (editingItem) {
        await api.put(
          `/${activeTab}/${editingItem._id}`,
          body
        );

        setToast(
          `${
            activeTab === "departments"
              ? "Department"
              : "Designation"
          } updated successfully`
        );
      } else {
        await api.post(`/${activeTab}`, body);

        setToast(
          `${
            activeTab === "departments"
              ? "Department"
              : "Designation"
          } added successfully`
        );
      }

      setModalOpen(false);

      await loadData();
    } catch (err) {
      console.error("Save error:", err);

      setToast(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // ----------------------------------------------------
  // DELETE
  // ----------------------------------------------------

  const handleDelete = async (item) => {
    const type =
      activeTab === "departments"
        ? "department"
        : "designation";

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}" ${type}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/${activeTab}/${item._id}`
      );

      setToast(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
      );

      await loadData();
    } catch (err) {
      console.error("Delete error:", err);

      setToast(
        err?.response?.data?.message ||
          "Unable to delete record"
      );
    }
  };

  return (
    <>
      {/* ------------------------------------------------ */}
      {/* PAGE HEADER */}
      {/* ------------------------------------------------ */}

      <PageHeader
        eyebrow="CONFIGURATION"
        title="Department & Designation Management"
        subtitle="Manage departments and designations used across the HRMS portal."
        action={
          <button
            className="primary-btn"
            onClick={openAddModal}
          >
            <Plus size={17} />

            Add{" "}
            {activeTab === "departments"
              ? "Department"
              : "Designation"}
          </button>
        }
      />

      {/* ------------------------------------------------ */}
      {/* SUMMARY CARDS */}
      {/* ------------------------------------------------ */}

      <div className="masters-summary">
        <div className="master-summary-card panel">
          <div className="master-summary-icon purple">
            <Building2 size={20} />
          </div>

          <div>
            <span>Total Departments</span>
            <strong>{departments.length}</strong>
          </div>
        </div>

        <div className="master-summary-card panel">
          <div className="master-summary-icon blue">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <span>Total Designations</span>
            <strong>{designations.length}</strong>
          </div>
        </div>

        <div className="master-summary-card panel">
          <div className="master-summary-icon green">
            <Users size={20} />
          </div>

          <div>
            <span>Master Records</span>
            <strong>
              {departments.length +
                designations.length}
            </strong>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* TABS */}
      {/* ------------------------------------------------ */}

      <div className="masters-tabs panel">
        <button
          className={
            activeTab === "departments"
              ? "active"
              : ""
          }
          onClick={() => {
            setActiveTab("departments");
            setSearch("");
            setError("");
          }}
        >
          <Building2 size={17} />

          Departments

          <span>
            {departments.length}
          </span>
        </button>

        <button
          className={
            activeTab === "designations"
              ? "active"
              : ""
          }
          onClick={() => {
            setActiveTab("designations");
            setSearch("");
            setError("");
          }}
        >
          <BriefcaseBusiness size={17} />

          Designations

          <span>
            {designations.length}
          </span>
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* SEARCH */}
      {/* ------------------------------------------------ */}

      <div className="masters-toolbar panel">
        <div className="masters-search">
          <Search size={17} />

          <input
            type="text"
            placeholder={`Search ${
              activeTab === "departments"
                ? "departments"
                : "designations"
            }...`}
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="clear-search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="master-count">
          Showing{" "}
          <strong>
            {filteredItems.length}
          </strong>{" "}
          of{" "}
          <strong>
            {currentItems.length}
          </strong>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* ERROR */}
      {/* ------------------------------------------------ */}

      {error && (
        <div className="master-error">
          <span>{error}</span>

          <button
            onClick={() => loadData()}
          >
            Retry
          </button>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* DATA */}
      {/* ------------------------------------------------ */}

      <div className="panel masters-table-panel">
        <div className="masters-table-header">
          <div>
            <h3>
              {activeTab === "departments"
                ? "Departments"
                : "Designations"}
            </h3>

            <p>
              {activeTab === "departments"
                ? "Manage all departments available in the organization."
                : "Manage all employee designations available in the organization."}
            </p>
          </div>

          <button
            className="secondary-btn"
            onClick={openAddModal}
          >
            <Plus size={15} />
            Add New
          </button>
        </div>

        {loading ? (
          <div className="masters-loading">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="masters-empty">
            <div className="masters-empty-icon">
              {activeTab === "departments" ? (
                <Building2 size={25} />
              ) : (
                <BriefcaseBusiness size={25} />
              )}
            </div>

            <h3>
              {search
                ? "No matching records"
                : `No ${
                    activeTab === "departments"
                      ? "departments"
                      : "designations"
                  } found`}
            </h3>

            <p>
              {search
                ? "Try another search term."
                : `Add your first ${
                    activeTab === "departments"
                      ? "department"
                      : "designation"
                  } to get started.`}
            </p>

            {!search && (
              <button
                className="primary-btn"
                onClick={openAddModal}
              >
                <Plus size={16} />
                Add{" "}
                {activeTab === "departments"
                  ? "Department"
                  : "Designation"}
              </button>
            )}
          </div>
        ) : (
          <div className="masters-table-wrap">
            <table className="masters-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    {activeTab === "departments"
                      ? "Department"
                      : "Designation"}
                  </th>

                  <th>
                    {activeTab === "departments"
                      ? "Description"
                      : "Department"}
                  </th>

                  <th>Created</th>

                  <th>Status</th>

                  <th className="text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map(
                  (item, index) => (
                    <tr key={item._id}>
                      <td>
                        <span className="master-index">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <div className="master-name">
                          <div className="master-row-icon">
                            {activeTab ===
                            "departments" ? (
                              <Building2
                                size={16}
                              />
                            ) : (
                              <BriefcaseBusiness
                                size={16}
                              />
                            )}
                          </div>

                          <div>
                            <strong>
                              {item.name}
                            </strong>

                            <small>
                              Master record
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="master-secondary">
                          {activeTab ===
                          "departments"
                            ? item.description ||
                              "No description"
                            : item.department ||
                              "All departments"}
                        </span>
                      </td>

                      <td>
                        <span className="master-secondary">
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}
                        </span>
                      </td>

                      <td>
                        <span className="master-status">
                          <CheckCircle2
                            size={13}
                          />
                          Active
                        </span>
                      </td>

                      <td>
                        <div className="master-actions">
                          <button
                            className="master-edit-btn"
                            title="Edit"
                            onClick={() =>
                              openEditModal(item)
                            }
                          >
                            <Pencil
                              size={15}
                            />
                          </button>

                          <button
                            className="master-delete-btn"
                            title="Delete"
                            onClick={() =>
                              handleDelete(item)
                            }
                          >
                            <Trash2
                              size={15}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* ADD / EDIT MODAL */}
      {/* ------------------------------------------------ */}

      <Modal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        title={
          editingItem
            ? `Edit ${
                activeTab === "departments"
                  ? "Department"
                  : "Designation"
              }`
            : `Add ${
                activeTab === "departments"
                  ? "Department"
                  : "Designation"
              }`
        }
      >
        <form
          className="form-grid"
          onSubmit={handleSave}
        >
          <label className="form-span">
            {activeTab === "departments"
              ? "Department Name"
              : "Designation Name"}

            <input
              name="name"
              required
              autoFocus
              placeholder={
                activeTab === "departments"
                  ? "e.g. Technology"
                  : "e.g. Software Developer"
              }
              defaultValue={
                editingItem?.name || ""
              }
            />
          </label>

          {activeTab === "departments" ? (
            <label className="form-span">
              Description

              <textarea
                name="description"
                placeholder="Enter department description"
                defaultValue={
                  editingItem?.description ||
                  ""
                }
              />
            </label>
          ) : (
            <label className="form-span">
              Department

              <select
                name="department"
                defaultValue={
                  editingItem?.department ||
                  ""
                }
              >
                <option value="">
                  All Departments
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={department._id}
                      value={department.name}
                    >
                      {department.name}
                    </option>
                  )
                )}
              </select>
            </label>
          )}

          <div className="form-actions form-span">
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setModalOpen(false)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              {editingItem ? (
                <>
                  <Pencil size={15} />
                  Update
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Create
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      <Toast
        message={toast}
        onClose={() => setToast("")}
      />
    </>
  );
}