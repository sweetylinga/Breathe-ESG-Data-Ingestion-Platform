import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [records, setRecords] = useState([]);
  const [auditLogs, setAuditLogs] = useState([])
  const [searchTerm, setSearchTerm] =
  useState("");

const [scopeFilter, setScopeFilter] =
  useState("All");
  const [companyFilter,setCompanyFilter] = 
  useState(
  "All Companies"
);
  const [file, setFile] = useState(null);
 const [sourceType, setSourceType] =
useState(
  "SAP Fuel & Procurement"
);

  // Fetch Records
  
  const fetchRecords = async () => {
    try {
      const response =
  await fetch(

`${import.meta.env.VITE_API_URL}/api/records/?company=${companyFilter}`

);

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.log(error);
    }
  };
const fetchAuditLogs = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/audit-logs/`
    );

    const data =
      await response.json();

    setAuditLogs(data);

  } catch (error) {
    console.log(error);
  }
};



useEffect(() => {
  fetchRecords();
  fetchAuditLogs();
}, [companyFilter]);
  // Upload CSV

const handleUpload = async () => {
  if (!file) {
    alert("Please select a CSV file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("source_type", sourceType);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/upload/`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("CSV uploaded successfully");

      // refresh table/chart/cards
      fetchRecords();

      // IMPORTANT FIX
      // clear selected file so same file uploads again
      setFile(null);

      // clear browser file input
      document.getElementById(
        "csvInput"
      ).value = "";
    } else {
      alert(data.error || "Upload failed");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};
// Edit Record
const handleEdit = async (id) => {

  const newAmount =
    prompt(
      "Enter new amount"
    );

  if (!newAmount) return;

  try {

    const response =
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/edit/${id}/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            amount:
              Number(
                newAmount
              ),
          }),
        }
      );

    if (response.ok) {

      fetchRecords();

      fetchAuditLogs();

      alert(
        "Record updated"
      );
    }

  } catch (error) {

    console.log(error);
  }
};
// Download Audit Report
const handleDownloadAuditReport =
  () => {

    window.open(
      `${import.meta.env.VITE_API_URL}/api/download-audit-report/`,
      "_blank"
    );
};
  // Approve Record
  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/approve/${id}/`
      );

      if (response.ok) {

  fetchRecords();

  fetchAuditLogs();
}
    } catch (error) {
      console.log(error);
    }
  };

  // Stats
  const totalRecords = records.length;

  const approvedRecords = records.filter(
    (record) => record.status === "Approved"
  ).length;

  const pendingRecords = records.filter(
    (record) => record.status === "Pending"
  ).length;
const editedRecords =
  records.filter(
    (record) =>
      record.is_edited
  ).length;

const suspiciousRecords =
  records.filter(
    (record) =>
      record.amount > 500
  ).length;

const lockedRecords =
  records.filter(
    (record) =>
      record.locked_for_audit
  ).length;
// Scope Analytics
const scopeData = [
  {
    name: "Scope 1",

    value:
      records.filter(
        (record) =>
          record.scope ===
          "Scope 1"
      ).length,
  },

  {
    name: "Scope 2",

    value:
      records.filter(
        (record) =>
          record.scope ===
          "Scope 2"
      ).length,
  },

  {
    name: "Scope 3",

    value:
      records.filter(
        (record) =>
          record.scope ===
          "Scope 3"
      ).length,
  },
];

// Approval Analytics
const statusData = [
  {
    name: "Approved",
    value:
      approvedRecords,
  },

  {
    name: "Pending",
    value:
      pendingRecords,
  },
];

// Risk Analytics
const riskData = [
  {
    name: "Suspicious",
    value:
      suspiciousRecords,
  },

  {
    name: "Safe",

    value:
      totalRecords -
      suspiciousRecords,
  },
];

  const filteredRecords = records.filter(
  (record) => {
    const matchesSearch =
      record.emission_record
        ?.toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesScope =
      scopeFilter === "All"
        ? true
        : record.scope ===
          scopeFilter;

    return (
      matchesSearch &&
      matchesScope
    );
  }
);

  return (
    <div
      style={{
        background: "#f3f6fb",
        minHeight: "100vh",
        padding: "35px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "42px",
            color: "#0f172a",
            fontWeight: "700",
          }}
        >
          🌍 Breathe ESG Data Ingestion Platform
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#64748b",
            fontSize: "18px",
          }}
        >
          ESG Upload & Analyst Review Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px,1fr))",
          gap: "22px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#2563eb",
            borderRadius: "24px",
            color: "white",
            padding: "28px",
            boxShadow: "0 8px 20px rgba(37,99,235,0.2)",
          }}
        >
          <h3>Total Records</h3>
          <h1 style={{ fontSize: "48px", margin: 0 }}>
            {totalRecords}
          </h1>
        </div>

        <div
          style={{
            background: "#16a34a",
            borderRadius: "24px",
            color: "white",
            padding: "28px",
            boxShadow: "0 8px 20px rgba(22,163,74,0.2)",
          }}
        >
          <h3>Approved</h3>
          <h1 style={{ fontSize: "48px", margin: 0 }}>
            {approvedRecords}
          </h1>
        </div>

        <div
          style={{
            background: "#f59e0b",
            borderRadius: "24px",
            color: "white",
            padding: "28px",
            boxShadow: "0 8px 20px rgba(245,158,11,0.2)",
          }}
        >
          <h3>Pending</h3>
          <h1 style={{ fontSize: "48px", margin: 0 }}>
            {pendingRecords}
          </h1>
        </div>
        <div
  style={{
    background: "#2563eb",
    borderRadius: "24px",
    color: "white",
    padding: "28px",
    boxShadow:
      "0 8px 20px rgba(37,99,235,0.2)",
  }}
>
  <h3>Edited</h3>

  <h1
    style={{
      fontSize: "48px",
      margin: 0,
    }}
  >
    {editedRecords}
  </h1>
</div>

<div
  style={{
    background: "#ef4444",
    borderRadius: "24px",
    color: "white",
    padding: "28px",
    boxShadow:
      "0 8px 20px rgba(239,68,68,0.2)",
  }}
>
  <h3>Suspicious</h3>

  <h1
    style={{
      fontSize: "48px",
      margin: 0,
    }}
  >
    {suspiciousRecords}
  </h1>
</div>

<div
  style={{
    background: "#64748b",
    borderRadius: "24px",
    color: "white",
    padding: "28px",
    boxShadow:
      "0 8px 20px rgba(100,116,139,0.2)",
  }}
>
  <h3>Locked</h3>

  <h1
    style={{
      fontSize: "48px",
      margin: 0,
    }}
  >
    {lockedRecords}
  </h1>
</div>
      </div>

      
{/* Upload Section */}
<div
  style={{
    background: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    marginBottom: "30px",
  }}
>
  <h2
    style={{
      textAlign: "center",
      marginBottom: "30px",
      color: "#0f172a",
    }}
  >
    Upload ESG Data
  </h2>

  <div style={{ marginBottom: "25px" }}>
    <label
      style={{
        fontWeight: "bold",
        color: "#334155",
      }}
    >
      Select Source Type
    </label>

    <select
      value={sourceType}
      onChange={(e) =>
        setSourceType(e.target.value)
      }
      style={{
        width: "100%",
        padding: "16px",
        marginTop: "10px",
        borderRadius: "14px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
      }}
    >
      <option>
  SAP Fuel & Procurement
</option>

<option>
  Utility Portal Export
</option>

<option>
  Corporate Travel Platform
</option>
    </select>
  </div>

  <div
    style={{
      marginBottom: "25px",
      textAlign: "center",
    }}
  >
    <label
      style={{
        fontWeight: "bold",
        color: "#334155",
        display: "block",
        marginBottom: "15px",
        fontSize: "18px",
      }}
    >
      Upload CSV File
    </label>

    <input
      id="csvInput"
      type="file"
      accept=".csv"
      onChange={(e) =>
        setFile(e.target.files[0])
      }
      style={{
        display: "block",
        margin: "0 auto",
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        cursor: "pointer",
      }}
    />
  </div>

  <div style={{ textAlign: "center" }}>
    <button
      onClick={handleUpload}
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "16px 28px",
        borderRadius: "14px",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Upload Data
    </button>
  </div>
</div>
      {/* Analytics */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "35px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#0f172a",
            marginBottom: "25px",
          }}
        >
          Emission Analytics
        </h2>

       <ResponsiveContainer
  width="100%"
  height={450}
>
          <BarChart data={records}>
            <CartesianGrid strokeDasharray="3 3" />
<XAxis
  dataKey="emission_record"
  angle={-35}
  textAnchor="end"
  interval={0}
  height={120}
  tick={{
    fontSize: 12
  }}
/>
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>


      <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px,1fr))",

    gap: "25px",

    marginBottom: "30px",
  }}
>

  {/* Scope Distribution */}
  <div
    style={{
      background: "white",
      borderRadius: "24px",
      padding: "25px",
      boxShadow:
        "0 8px 25px rgba(0,0,0,0.08)",
    }}
  >
    <h2
      style={{
        textAlign: "center",
      }}
    >
      Scope Distribution
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>
        <Pie
          data={scopeData}
          dataKey="value"
          nameKey="name"
        >
          {scopeData.map(
            (_, index) => (
              <Cell
                key={index}
              />
            )
          )}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Approval Status */}
  <div
    style={{
      background: "white",
      borderRadius: "24px",
      padding: "25px",
      boxShadow:
        "0 8px 25px rgba(0,0,0,0.08)",
    }}
  >
    <h2
      style={{
        textAlign: "center",
      }}
    >
      Approval Status
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart
        data={statusData}
      >
        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="name"
        />

        <YAxis />

        <Tooltip />

        <Bar
          dataKey="value"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Risk Distribution */}
  <div
    style={{
      background: "white",
      borderRadius: "24px",
      padding: "25px",
      boxShadow:
        "0 8px 25px rgba(0,0,0,0.08)",
    }}
  >
    <h2
      style={{
        textAlign: "center",
      }}
    >
      Risk Distribution
    </h2>

    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>
        <Pie
          data={riskData}
          dataKey="value"
          nameKey="name"
        >
          {riskData.map(
            (_, index) => (
              <Cell
                key={index}
              />
            )
          )}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

      {/* Table */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "35px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <select
  value={
    companyFilter
  }

  onChange={(e) =>
    setCompanyFilter(
      e.target.value
    )
  }

  style={{
    padding:
      "12px",

    borderRadius:
      "12px",

    border:
      "1px solid #ddd",

    marginBottom:
      "20px",

    width:
      "250px",
  }}
>
  <option>
    All Companies
  </option>

  <option>
    Demo Company
  </option>

  <option>
    Tata Steel
  </option>

  <option>
    Infosys
  </option>

  <option>
    Reliance
  </option>
</select>

<h2
  style={{
    textAlign: "center",
    color: "#0f172a",
    marginBottom: "25px",
  }}
>
  Emission Records Dashboard
</h2>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  }}
>
  <input
    type="text"
    placeholder="Search activity..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    style={{
      padding: "14px",
      width: "300px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      fontSize: "16px",
    }}
  />


  <select
    value={scopeFilter}
    onChange={(e) =>
      setScopeFilter(
        e.target.value
      )
    }
    style={{
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      fontSize: "16px",
    }}
  >
    <option value="All">
      All Scopes
    </option>

    <option value="Scope 1">
      Scope 1
    </option>

    <option value="Scope 2">
      Scope 2
    </option>

    <option value="Scope 3">
      Scope 3
    </option>
  </select>
</div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#2563eb",
                  color: "white",
                }}
              >
<th style={{ padding: "18px" }}>
  Activity
</th>
<th>Amount</th>
<th>Scope</th>
<th>Status</th>
<th>Edited</th>
<th>Risk</th>
<th>Action</th>
              </tr>
            </thead>
<tbody>
  {filteredRecords.map((record) => (
                <tr
  key={record.id}
  style={{
    background:
      record.amount > 500
        ? "#fee2e2"
        : "white",
  }}
>
                  <td
                    style={{
                      padding: "18px",
                      textAlign: "center",
                    }}
                  >
                    {record.emission_record}
                  </td>

                 <td style={{ textAlign: "center" }}>
  {record.amount}
</td>



 

<td
  style={{
    textAlign: "center",
    fontWeight: "bold",
    color:
      record.scope === "Scope 1"
        ? "#ef4444"
        : record.scope === "Scope 2"
        ? "#2563eb"
        : "#16a34a",
  }}
>
  {record.scope}
</td>

<td style={{ textAlign: "center" }}>
  {record.status === "Approved" ? (
    <span
      style={{
        background: "#22c55e",
        color: "white",
        padding: "8px 16px",
        borderRadius: "12px",
        fontWeight: "bold",
      }}
    >
      Approved
    </span>
  ) : (
    <span
      style={{
        background: "#f59e0b",
        color: "white",
        padding: "8px 16px",
        borderRadius: "12px",
        fontWeight: "bold",
      }}
    >
      Pending
    </span>
  )}
</td>
<td style={{ textAlign: "center" }}>
  {record.is_edited ? (
    <span
      style={{
        background: "#3b82f6",
        color: "white",
        padding: "8px 12px",
        borderRadius: "10px",
        fontWeight: "bold",
      }}
    >
      Edited
    </span>
  ) : (
    <span
      style={{
        color: "#94a3b8",
        fontWeight: "bold",
      }}
    >
      No
    </span>
  )}
</td>

<td style={{ textAlign: "center" }}>
  {record.amount > 500 ? (
    <span
      style={{
        background: "#ef4444",
        color: "white",
        padding: "8px 12px",
        borderRadius: "10px",
        fontWeight: "bold",
      }}
    >
      ⚠ Suspicious
    </span>
  ) : (
    <span
      style={{
        background: "#22c55e",
        color: "white",
        padding: "8px 12px",
        borderRadius: "10px",
        fontWeight: "bold",
      }}
    >
      Safe
    </span>
  )}
</td>

                    <td
  style={{
    textAlign: "center",
  }}
>
 <button
  onClick={() =>
    handleEdit(record.id)
  }

  disabled={
    record.locked_for_audit
  }
    style={{
  background:
    record.locked_for_audit
      ? "#94a3b8"
      : "#3b82f6",

  color: "white",

  border: "none",

  padding:
    "10px 16px",

  borderRadius:
    "10px",

  cursor:
    record.locked_for_audit
      ? "not-allowed"
      : "pointer",

  marginRight:
    "10px",

  fontWeight:
    "bold",
}}
  >
  {record.locked_for_audit
  ? "Locked"
  : "Edit"}
  </button>

  <button
    onClick={() =>
      handleApprove(
        record.id
      )
    }
    disabled={
      record.status ===
      "Approved"
    }
    style={{
      background:
        record.status ===
        "Approved"
          ? "#94a3b8"
          : "#16a34a",
      color:
        "white",
      border: "none",
      padding:
        "10px 18px",
      borderRadius:
        "12px",
      cursor:
        "pointer",
      fontWeight:
        "bold",
    }}
  >
    {record.status ===
    "Approved"
      ? "Approved"
      : "Approve"}
  </button>
</td>
        
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Audit Logs */}
<div
  style={{
    background: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    marginTop: "30px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.08)",
  }}
>
 <div
  style={{
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    marginBottom:
      "25px",
  }}
>
  <h2
    style={{
      color: "#0f172a",
      margin: 0,
    }}
  >
    Audit Logs
  </h2>

  <button
    onClick={
      handleDownloadAuditReport
    }
    style={{
      background:
        "#2563eb",
      color: "white",
      border: "none",
      padding:
        "12px 20px",
      borderRadius:
        "12px",
      cursor:
        "pointer",
      fontWeight:
        "bold",
    }}
  >
    Download Audit Report
  </button>
</div>

  {auditLogs.length === 0 ? (

    <p
      style={{
        textAlign: "center",
        color: "#64748b",
      }}
    >
      No audit logs yet
    </p>

  ) : (

    <table
      style={{
        width: "100%",
        borderCollapse:
          "collapse",
      }}
    >
      <thead>
        <tr
          style={{
            background:
              "#2563eb",
            color: "white",
          }}
        >
          <th
            style={{
              padding:
                "16px",
            }}
          >
            Action
          </th>

          <th>
            Timestamp
          </th>
        </tr>
      </thead>

      <tbody>
        {auditLogs.map(
          (
            log,
            index
          ) => (
            <tr
              key={
                index
              }
              style={{
                borderBottom:
                  "1px solid #ddd",
              }}
            >
              <td
                style={{
                  padding:
                    "16px",
                  textAlign:
                    "center",
                }}
              >
                {
                  log.action
                }
              </td>

              <td
                style={{
                  textAlign:
                    "center",
                }}
              >
                {
                  log.timestamp
                }
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
}

export default App;