document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. DARK / LIGHT MODE TOGGLE (localStorage)
  // ==========================================
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  const applyTheme = (theme) => {
    htmlElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("portfolioTheme", theme);

    if (themeIcon && themeText) {
      if (theme === "dark") {
        themeIcon.className = "bi bi-sun-fill";
        themeText.textContent = "Light Mode";
      } else {
        themeIcon.className = "bi bi-moon-stars-fill";
        themeText.textContent = "Dark Mode";
      }
    }
  };

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem("portfolioTheme") || "light";
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-bs-theme");
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
    });
  }

  // ==========================================
  // 2. SKILL BAR ANIMATION ON SCROLL & CV DOWNLOAD
  // ==========================================
  const skillBars = document.querySelectorAll(".skill-bar");
  const skillsSection = document.getElementById("skillsSection");

  if (skillsSection && skillBars.length > 0) {
    const animateSkills = () => {
      skillBars.forEach((bar) => {
        const targetWidth = bar.getAttribute("data-width");
        bar.style.width = targetWidth;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(skillsSection);
  }

  const downloadCvBtn = document.getElementById("downloadCvBtn");
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener("click", () => {
      const cvContent = `CURRICULUM VITAE
==================================================
Name: James Vincent F. Pamintuan
Age / Birthday: 19 years old (December 1, 2006)
Location: San Marcelino, Zambales
School: Polytechnic College of Botolan (BSIT 2A - 2nd Year)
Contact: 0951-285-315
Email: jamesvincentpamintuan@pcb.edu.ph
Facebook: James Pamintuan

CAREER GOAL
To become a successful, aspiring IT professional while building practical digital solutions and Social Media Management (SMM) skills.

PERSONAL MOTTO
"Focus on my goal and Love my family."

CORE SKILLS
- Multitasking & Time Management
- HTML5, CSS3, Bootstrap 5, JavaScript
- Social Media Management (SMM) & Content Planning
==================================================`;

      const blob = new Blob([cvContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "James_Vincent_Pamintuan_CV.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // ==========================================
  // 3. PROJECT CATEGORY FILTER & DETAILS MODAL
  // ==========================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  if (filterButtons.length > 0 && projectItems.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update active button styling
        filterButtons.forEach((b) => {
          b.classList.remove("active", "btn-emerald");
          b.classList.add("btn-outline-emerald");
        });
        btn.classList.add("active", "btn-emerald");
        btn.classList.remove("btn-outline-emerald");

        const selectedCategory = btn.getAttribute("data-filter");

        projectItems.forEach((item) => {
          const itemCategory = item.getAttribute("data-category");
          if (selectedCategory === "all" || itemCategory === selectedCategory) {
            item.classList.remove("d-none");
          } else {
            item.classList.add("d-none");
          }
        });
      });
    });
  }

  // Populate Project Details Modal
  const detailButtons = document.querySelectorAll(".view-details-btn");
  const projectModalEl = document.getElementById("projectDetailModal");

  if (detailButtons.length > 0 && projectModalEl) {
    const projectModal = new bootstrap.Modal(projectModalEl);

    detailButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("projectModalTitle").textContent = btn.getAttribute("data-title");
        document.getElementById("projectModalCategory").textContent = btn.getAttribute("data-category");
        document.getElementById("projectModalTools").textContent = btn.getAttribute("data-tools");
        document.getElementById("projectModalDescription").textContent = btn.getAttribute("data-description");
        document.getElementById("projectModalOutcome").textContent = btn.getAttribute("data-outcome");
        projectModal.show();
      });
    });
  }

  // ==========================================
  // 4. CONTACT FORM VALIDATION & SAVED MESSAGES
  // ==========================================
  const contactForm = document.getElementById("contactForm");
  const savedMessagesList = document.getElementById("savedMessagesList");
  const clearMessagesBtn = document.getElementById("clearMessagesBtn");

  const renderSavedMessages = () => {
    if (!savedMessagesList) return;
    const messages = JSON.parse(localStorage.getItem("portfolioMessages")) || [];

    if (messages.length === 0) {
      savedMessagesList.innerHTML = `<p class="mb-0 text-body-secondary">No messages submitted yet.</p>`;
      return;
    }

    savedMessagesList.innerHTML = messages
      .map(
        (msg) => `
        <div class="border rounded p-3 mb-2 bg-body-tertiary">
          <div class="d-flex justify-content-between">
            <strong>${msg.name}</strong>
            <span class="badge bg-emerald-subtle text-emerald">${msg.topic}</span>
          </div>
          <div class="text-body-secondary small mb-1">${msg.email} • ${msg.date}</div>
          <p class="mb-0">${msg.message}</p>
        </div>`
      )
      .join("");
  };

  if (savedMessagesList) {
    renderSavedMessages();
  }

  if (clearMessagesBtn) {
    clearMessagesBtn.addEventListener("click", () => {
      localStorage.removeItem("portfolioMessages");
      renderSavedMessages();
    });
  }

  if (contactForm) {
    const nameInput = document.getElementById("senderName");
    const emailInput = document.getElementById("senderEmail");
    const topicInput = document.getElementById("inquiryTopic");
    const messageInput = document.getElementById("senderMessage");
    const formAlert = document.getElementById("formAlert");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let isValid = true;
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      // Validate Name
      if (nameVal.length < 2) {
        nameInput.classList.add("is-invalid");
        nameInput.classList.remove("is-valid");
        isValid = false;
      } else {
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
      }

      // Validate Email
      if (!emailRegex.test(emailVal)) {
        emailInput.classList.add("is-invalid");
        emailInput.classList.remove("is-valid");
        isValid = false;
      } else {
        emailInput.classList.remove("is-invalid");
        emailInput.classList.add("is-valid");
      }

      // Validate Message Length
      if (messageVal.length < 15) {
        messageInput.classList.add("is-invalid");
        messageInput.classList.remove("is-valid");
        isValid = false;
      } else {
        messageInput.classList.remove("is-invalid");
        messageInput.classList.add("is-valid");
      }

      if (!isValid) {
        formAlert.className = "alert alert-danger";
        formAlert.textContent = "Please fix the highlighted fields before submitting your message.";
        return;
      }

      // Save valid submission to localStorage
      const existingMessages = JSON.parse(localStorage.getItem("portfolioMessages")) || [];
      existingMessages.unshift({
        name: nameVal,
        email: emailVal,
        topic: topicInput.value,
        message: messageVal,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("portfolioMessages", JSON.stringify(existingMessages));

      // Show Success Feedback
      formAlert.className = "alert alert-success";
      formAlert.textContent = `Thank you, ${nameVal}! Your message has been validated and saved locally.`;

      contactForm.reset();
      [nameInput, emailInput, messageInput].forEach((el) => el.classList.remove("is-valid"));
      renderSavedMessages();
    });
  }
});