// Handle student sign up
function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("signupMsg");
  
    if (!name || !email || !password) {
      msg.textContent = "❌ Fill all fields.";
      msg.style.color = "red";
      return;
    }
  
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.email === email)) {
      msg.textContent = "❌ Email already exists.";
      msg.style.color = "red";
      return;
    }
  
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("grades_" + name, JSON.stringify(["Math: A", "Science: B"]));
    localStorage.setItem("assignments_" + name, JSON.stringify(["Essay", "Project"]));
  
    msg.textContent = "✅ Registered!";
    msg.style.color = "green";
  }
  
  // Handle student login
  function login() {
    const name = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const msg = document.getElementById("loginMsg");
  
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.name === name && u.password === pass);
  
    if (user) {
      localStorage.setItem("studentName", user.name);
      window.location.href = "dashboard.html";
    } else {
      msg.textContent = "❌ Incorrect name or password.";
      msg.style.color = "red";
    }
  }
  
  // Show dashboard data
  if (document.URL.includes("dashboard.html")) {
    const name = localStorage.getItem("studentName");
    if (!name) window.location.href = "login.html";
    document.getElementById("studentName").textContent = name;
  
    const assignments = JSON.parse(localStorage.getItem("assignments_" + name) || "[]");
    const grades = JSON.parse(localStorage.getItem("grades_" + name) || "[]");
  
    document.getElementById("assignmentList").innerHTML = assignments.map(a => `<li>${a}</li>`).join("");
    document.getElementById("gradesList").innerHTML = grades.map(g => `<li>${g}</li>`).join("");
  }
  
  // Upload assignment
  function uploadAssignment() {
    const name = localStorage.getItem("studentName");
    const fileInput = document.getElementById("assignmentFile");
    const msg = document.getElementById("uploadMsg");
  
    if (fileInput.files.length === 0) {
      msg.textContent = "❌ Choose a file.";
      return;
    }
  
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    reader.onload = function () {
      const submissions = JSON.parse(localStorage.getItem("submissions") || "{}");
      if (!submissions[name]) submissions[name] = [];
      submissions[name].push({
        fileName: file.name,
        uploadedAt: new Date().toLocaleString(),
        content: reader.result
      });
      localStorage.setItem("submissions", JSON.stringify(submissions));
      msg.textContent = "✅ File uploaded!";
    };
  
    reader.readAsDataURL(file);
  }
  
  // Admin login
  function adminLogin() {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;
    const msg = document.getElementById("adminMsg");
  
    if (user === "admin" && pass === "admin123") {
      window.location.href = "manage.html";
    } else {
      msg.textContent = "❌ Wrong credentials.";
      msg.style.color = "red";
    }
  }
  
  // Manage student data
  if (document.URL.includes("manage.html")) {
    const selector = document.getElementById("studentSelector");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
    users.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u.name;
      opt.textContent = u.name;
      selector.appendChild(opt);
    });
  
    showAllSubmissions();
  }
  
  // Load & save student info
  function loadStudentData() {
    const name = document.getElementById("studentSelector").value;
    document.getElementById("editAssignments").value = (JSON.parse(localStorage.getItem("assignments_" + name)) || []).join("\n");
    document.getElementById("editGrades").value = (JSON.parse(localStorage.getItem("grades_" + name)) || []).join("\n");
  }
  
  function saveStudentData() {
    const name = document.getElementById("studentSelector").value;
    const assignments = document.getElementById("editAssignments").value.split("\n");
    const grades = document.getElementById("editGrades").value.split("\n");
  
    localStorage.setItem("assignments_" + name, JSON.stringify(assignments));
    localStorage.setItem("grades_" + name, JSON.stringify(grades));
    alert("✅ Data saved.");
  }
  
  // Show uploaded files
  function showAllSubmissions() {
    const container = document.getElementById("allSubmissions");
    const data = JSON.parse(localStorage.getItem("submissions") || "{}");
  
    for (let student in data) {
      const div = document.createElement("div");
      div.innerHTML = `<h3>${student}</h3>`;
      data[student].forEach(f => {
        const a = document.createElement("a");
        a.href = f.content;
        a.download = f.fileName;
        a.textContent = `📄 ${f.fileName} (${f.uploadedAt})`;
        a.style.display = "block";
        div.appendChild(a);
      });
      container.appendChild(div);
    }
  }
  