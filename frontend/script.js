// Welcome message (Homepage only)
if (document.title === "Marine Pollution Reporting & Analytics Platform") {
    window.onload = function () {
        alert("Welcome to the Marine Pollution Reporting & Analytics Platform!");
    };
}

// Homepage Buttons
const reportBtn = document.getElementById("reportBtn");

if (reportBtn) {
    reportBtn.addEventListener("click", function () {
        alert("Report Pollution page will be developed in the next module.");
    });
}

const learnBtn = document.getElementById("learnBtn");

if (learnBtn) {
    learnBtn.addEventListener("click", function () {
        alert("Scroll down to learn more about the project.");
    });
}

/// Login Form
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("loginRole").value;

        if (!role) {
            alert("Please select your login role.");
            return;
        }

        try {

            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    role
                })
            });

            const data = await response.json();

            alert(data.message);

            if (data.success) {

    localStorage.setItem("userRole", data.role);

    if (data.role === "government") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "dashboard.html";
    }

}

        } catch (error) {

            console.error(error);
            alert("Login failed.");

        }

    });

}
// Registration Form

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();
        alert("Register button clicked");

        
        const fullname = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullname,
                    email,
                    phone,
                    password
                })
            });

            const data = await response.json();

            alert(data.message);

            registerForm.reset();

        } catch (error) {

            console.error(error);
            alert("Registration failed.");

        }

    });

}
// Report Form

const reportForm = document.getElementById("reportForm");

if (reportForm) {

    reportForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const formData = new FormData();

        formData.append("reporter_name", document.getElementById("name").value);
        formData.append("reporter_email", document.getElementById("email").value);
        formData.append("pollution_type", document.getElementById("pollutionType").value);
        formData.append("severity", document.getElementById("severity").value);
        formData.append("report_date", document.getElementById("date").value);
        formData.append("location", document.getElementById("location").value);
        formData.append("description", document.getElementById("description").value);
        formData.append("latitude", document.getElementById("latitude").value);
formData.append("longitude", document.getElementById("longitude").value);

        const photo = document.getElementById("photo").files[0];
        const labReport = document.getElementById("labReport").files[0];

        if (photo) {
            formData.append("photo", photo);
        }

        if (labReport) {
            formData.append("lab_report", labReport);
        }

        try {

            const response = await fetch("http://127.0.0.1:5000/report", {

                method: "POST",

                body: formData

            });

            const data = await response.json();

            alert(data.message);

            if (response.ok) {
                reportForm.reset();
            }

        } catch (error) {

            console.log(error);

            alert("Failed to submit report.");

        }

    });

}
const chartCanvas = document.getElementById("pollutionChart");

if (chartCanvas) {

    fetch("http://127.0.0.1:5000/pollution-type-count")
        .then(response => response.json())
        .then(data => {

            new Chart(chartCanvas, {
                type: "bar",
                data: {
                    labels: ["Plastic", "Oil Spill", "Chemical", "Sewage"],
                    datasets: [{
                        label: "Number of Reports",
                        data: [
                            data["Plastic Waste"] || 0,
                            data["Oil Spill"] || 0,
                            data["Chemical Waste"] || 0,
                            data["Sewage"] || 0
                        ]
                    }]
                },
                options: {
    responsive: true,

    plugins: {
        legend: {
            labels: {
                color: "#ffffff",
                font: {
                    size: 14,
                    weight: "bold"
                }
            }
        }
    },

    scales: {
        x: {
            ticks: {
                color: "#ffffff",
                font: {
                    size: 14,
                    weight: "bold"
                }
            },
            title: {
                display: true,
                text: "Pollution Type",
                color: "#ffffff",
                font: {
                    size: 15,
                    weight: "bold"
                }
            },
            grid: {
                color: "rgba(255,255,255,0.15)"
            }
        },

        y: {
            beginAtZero: true,

            ticks: {
                color: "#ffffff",
                font: {
                    size: 14,
                    weight: "bold"
                },
                stepSize: 1
            },

            title: {
                display: true,
                text: "Number of Reports",
                color: "#ffffff",
                font: {
                    size: 15,
                    weight: "bold"
                }
            },

            grid: {
                color: "rgba(255,255,255,0.15)"
            }
        }
    }
}
            });

        })
        .catch(error => {
            console.error("Error loading pollution chart:", error);
        });
}
// Chatbot

const sendBtn = document.getElementById("sendBtn");

if (sendBtn) {

    sendBtn.addEventListener("click", function () {

        const input = document.getElementById("userInput");
        const chatBox = document.getElementById("chatBox");

        const question = input.value.trim();

        if (question === "") {
            return;
        }

        // User message
        const userMsg = document.createElement("div");
        userMsg.className = "user-message";
        userMsg.textContent = question;
        chatBox.appendChild(userMsg);

        // Simple predefined responses
        const botMsg = document.createElement("div");
        botMsg.className = "bot-message";

        const q = question.toLowerCase();

        if (q.includes("what is marine pollution") || q.includes("marine pollution")) {
    botMsg.textContent = "Marine pollution is the contamination of oceans and seas by harmful substances such as plastic, oil, chemicals and sewage.";
} else if (q.includes("plastic")) {
    botMsg.textContent = "Plastic pollution harms marine animals and ecosystems. Reducing single-use plastics and properly disposing of waste can help reduce it.";
} else if (q.includes("oil")) {
    botMsg.textContent = "Oil spills can damage marine life and coastal habitats. Quick cleanup and proper oil-spill management can reduce the damage.";
} else if (q.includes("chemical")) {
    botMsg.textContent = "Chemical pollution contaminates water and can affect aquatic organisms and marine ecosystems.";
} else if (q.includes("marine life") || q.includes("animals")) {
    botMsg.textContent = "Marine pollution can harm fish, turtles, birds, corals and other marine organisms.";
} else if (q.includes("reduce") || q.includes("prevent")) {
    botMsg.textContent = "Marine pollution can be reduced by avoiding plastic waste, treating sewage, preventing oil spills, recycling and disposing of waste properly.";
} else if (q.includes("found pollution") || q.includes("report pollution")) {
    botMsg.textContent = "If you find marine pollution, avoid direct contact with harmful substances, note the location and report it using the Marine Pollution Reporting System.";
} else if (q.includes("hello") || q.includes("hi")) {
    botMsg.textContent = "Hello! How can I help you today?";
} else {
    botMsg.textContent = "I can answer questions about marine pollution, plastic pollution, oil spills, chemical pollution, marine life and pollution prevention.";
}

        chatBox.appendChild(botMsg);

        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    });

}
// Load pollution reports on dashboard
fetch("http://127.0.0.1:5000/reports")
    .then(response => response.json())
    .then(reports => {

        const table = document.getElementById("reportsTable");

        const totalReports = document.getElementById("totalReports");
        totalReports.textContent = reports.length;

        // Remove old hard-coded report rows
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        // Add reports from database
        reports.forEach(report => {

            const row = table.insertRow();

            row.insertCell(0).textContent = report[4]; // Location
            row.insertCell(1).textContent = report[1]; // Pollution Type
            row.insertCell(2).textContent = report[2]; // Severity
            row.insertCell(3).textContent = "Pending"; // Status

        });

    })
    .catch(error => {
        console.error("Error loading reports:", error);
    });

    // Load registered users count
fetch("http://127.0.0.1:5000/users/count")
    .then(response => response.json())
    .then(data => {

        const registeredUsers = document.getElementById("registeredUsers");

        registeredUsers.textContent = data.count;

    })
    .catch(error => {
        console.error("Error loading registered users:", error);
    });
    // Load high risk areas count
fetch("http://127.0.0.1:5000/high-risk-areas")
    .then(response => response.json())
    .then(data => {

        const highRiskAreas = document.getElementById("highRiskAreas");

        highRiskAreas.textContent = data.count;

    })
    .catch(error => {
        console.error("Error loading high risk areas:", error);
    });

    fetch("http://127.0.0.1:5000/pending-reports")
    .then(response => response.json())
    .then(data => {
        document.getElementById("pendingReports").textContent = data.count;
    });

    // Load Analytics Total Reports
fetch("http://127.0.0.1:5000/reports")
    .then(response => response.json())
    .then(reports => {
        const total = document.getElementById("analyticsTotalReports");

        if (total) {
            total.textContent = reports.length;
        }
    })
    .catch(error => {
        console.error("Error loading analytics total reports:", error);
    });


// Load Pollution Type Analytics
fetch("http://127.0.0.1:5000/pollution-type-count")
    .then(response => response.json())
    .then(data => {

        const plastic = document.getElementById("plasticWasteCount");
        const oil = document.getElementById("oilSpillCount");
        const chemical = document.getElementById("chemicalWasteCount");

        if (plastic) {
            plastic.textContent = data["Plastic Waste"] || 0;
        }

        if (oil) {
            oil.textContent = data["Oil Spill"] || 0;
        }

        if (chemical) {
            chemical.textContent = data["Chemical Waste"] || 0;
        }

    })
    .catch(error => {
        console.error("Error loading pollution type analytics:", error);
    });


// Load Severity Analytics
fetch("http://127.0.0.1:5000/severity-count")
    .then(response => response.json())
    .then(data => {

        const high = document.getElementById("highSeverityCount");
        const medium = document.getElementById("mediumSeverityCount");
        const low = document.getElementById("lowSeverityCount");

        if (high) {
            high.textContent = data["High"] || 0;
        }

        if (medium) {
            medium.textContent = data["Medium"] || 0;
        }

        if (low) {
            low.textContent = data["Low"] || 0;
        }

    })
    .catch(error => {
        console.error("Error loading severity analytics:", error);
    });
