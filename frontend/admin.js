fetch("http://127.0.0.1:5000/reports")
    .then(response => response.json())
    .then(reports => {

        const tableBody = document.querySelector("#adminReportsTable tbody");

        reports.forEach(report => {

            const row = document.createElement("tr");
            if (report[2] === "High") {
    row.classList.add("critical-report-row");
}

            row.innerHTML = `
    <td>${report[0]}</td>
    <td>${report[4]}</td>
    <td>${report[1]}</td>

    <td>
        <span class="severity-badge severity-${report[2].toLowerCase()}">
            ${report[2]}
        </span>
    </td>
    <td>
    ${
        report[2] === "High"
        ? `<span class="priority-badge priority-critical">🔴 Critical Action</span>`
        : report[2] === "Medium"
        ? `<span class="priority-badge priority-review">🟠 Priority Review</span>`
        : `<span class="priority-badge priority-normal">🟢 Normal</span>`
    }
</td>

    <td>
    <span class="status-badge status-${report[8].toLowerCase()}">
        ${report[8]}
    </span>
</td>

<td>
    ${
        report[9]
        ? `<img src="http://127.0.0.1:5000/uploads/photos/${report[9]}"
               class="admin-report-photo"
               alt="Pollution Photo"
               onclick="window.open(this.src, '_blank')">`
        : `<span class="no-photo">No Photo</span>`
    }
</td>

<td>
    ${
        report[10]
        ? `<a href="http://127.0.0.1:5000/uploads/lab_reports/${report[10]}"
             target="_blank"
             class="lab-report-link">
             📄 View PDF
           </a>`
        : `<span class="no-photo">No Report</span>`
    }
</td>

<td>
    <button
        class="details-btn"
        onclick="viewReportDetails(${report[0]})">
        👁 View Details
    </button>
</td>

<td>
    <select onchange="updateStatus(${report[0]}, this.value)">
        <option value="Pending" ${report[8] === "Pending" ? "selected" : ""}>Pending</option>
        <option value="Approved" ${report[8] === "Approved" ? "selected" : ""}>Approved</option>
        <option value="Rejected" ${report[8] === "Rejected" ? "selected" : ""}>Rejected</option>
    </select>
    </td>
`;

            tableBody.appendChild(row);

        });

    })
    .catch(error => {
        console.error("Error loading admin reports:", error);
    });

    async function updateStatus(id, status) {

    try {

        const response = await fetch("http://127.0.0.1:5000/update-status", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id,
                status: status
            })

        });

        const data = await response.json();

if (response.ok) {

    const rows = document.querySelectorAll("#adminReportsTable tbody tr");

    rows.forEach(row => {

        if (row.cells[0].textContent == id) {

            const statusBadge = row.querySelector(".status-badge");

            if (statusBadge) {
                statusBadge.textContent = status;
                statusBadge.className = "status-badge status-" + status.toLowerCase();
            }
        }

    });

}

alert(data.message);
    } catch (error) {

        console.error("Error updating status:", error);

        alert("Failed to update status.");

    }

}
// ===========================
// Admin Report Filters
// ===========================

function filterAdminReports() {

    const searchValue = document.getElementById("reportSearch").value.toLowerCase();
    const typeValue = document.getElementById("typeFilter").value.toLowerCase();
    const severityValue = document.getElementById("severityFilter").value.toLowerCase();
    const statusValue = document.getElementById("statusFilter").value.toLowerCase();

    const rows = document.querySelectorAll("#adminReportsTable tbody tr");

    rows.forEach(row => {

        const location = row.cells[1]?.textContent.toLowerCase() || "";
        const pollutionType = row.cells[2]?.textContent.toLowerCase() || "";
        const severity = row.cells[3]?.textContent.toLowerCase() || "";
        const status = row.cells[4]?.textContent.toLowerCase() || "";

        const matchesSearch = location.includes(searchValue);
        const matchesType = !typeValue || pollutionType === typeValue;
        const matchesSeverity = !severityValue || severity === severityValue;
        const matchesStatus = !statusValue || status === statusValue;

        if (
            matchesSearch &&
            matchesType &&
            matchesSeverity &&
            matchesStatus
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}


// Search by location
document.getElementById("reportSearch").addEventListener(
    "input",
    filterAdminReports
);


// Filter by pollution type
document.getElementById("typeFilter").addEventListener(
    "change",
    filterAdminReports
);


// Filter by severity
document.getElementById("severityFilter").addEventListener(
    "change",
    filterAdminReports
);


// Filter by status
document.getElementById("statusFilter").addEventListener(
    "change",
    filterAdminReports
);
function viewReportDetails(id) {

    fetch("http://127.0.0.1:5000/reports")
        .then(response => response.json())
        .then(reports => {

            const report = reports.find(r => r[0] == id);

            if (!report) {
                alert("Report details not found.");
                return;
            }

            alert(
`🌊 Marine Pollution Report

Reporter Name: ${report[6]}
Email: ${report[7]}
Date: ${report[3]}

Location: ${report[4]}
Pollution Type: ${report[1]}
Severity: ${report[2]}
Status: ${report[8]}

Description:
${report[5]}`
            );
        })
        .catch(error => {
            console.error("Error loading report details:", error);
            alert("Unable to load report details.");
        });
}
// Emergency Pollution Alert

async function checkEmergencyAlerts() {

    try {

        const response = await fetch("http://127.0.0.1:5000/reports");
        const reports = await response.json();

        const highRiskReports = reports.filter(
            report => report[3] === "High"
        );

        const alertText = document.getElementById("emergencyAlertText");

        if (!alertText) return;

        if (highRiskReports.length > 0) {

            alertText.innerHTML =
                `⚠️ ${highRiskReports.length} high-severity pollution report(s) require immediate attention.`;

        } else {

            alertText.innerHTML =
                "✅ No high-severity pollution reports currently detected.";

        }

    } catch (error) {

        console.error("Emergency alert error:", error);

    }
}

checkEmergencyAlerts();
function exportAdminReports() {
    const rows = document.querySelectorAll("#adminReportsTable tbody tr");

    let csv = "ID,Location,Pollution Type,Severity,Priority,Status\n";

    rows.forEach(row => {
        if (row.style.display === "none") return;

        const cells = row.cells;

        const values = [
            cells[0]?.innerText,
            cells[1]?.innerText,
            cells[2]?.innerText,
            cells[3]?.innerText,
            cells[4]?.innerText,
            cells[5]?.innerText
        ].map(value => `"${(value || "").replace(/"/g, '""')}"`);

        csv += values.join(",") + "\n";
    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "marineguard_pollution_reports.csv";
    link.click();

    URL.revokeObjectURL(url);
}