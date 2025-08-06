/**
 * Agentic AI Use Case Assessment Tool
 * Main Application Class - Simplified & Professional
 */

class UseCaseApp {
  constructor() {
    this.useCases = [];
    this.editingIndex = -1;
    this.isDirty = false;

    // Load data from localStorage
    this.loadData();

    // Initialize the app
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    console.log("🚀 Initializing AI Use Case Assessment Tool...");

    this.setupEventListeners();
    this.initializeSliders();
    this.updateAllViews();
    this.setupAutoSave();

    console.log("✅ Application initialized successfully");
  }

  /**
   * Load data from localStorage
   */
  loadData() {
    try {
      const saved = localStorage.getItem("useCases");
      this.useCases = saved ? JSON.parse(saved) : [];
      console.log(`📊 Loaded ${this.useCases.length} use cases`);
    } catch (error) {
      console.error("❌ Error loading data:", error);
      showAlert("Error loading saved data. Starting fresh.", "warning");
      this.useCases = [];
    }
  }

  /**
   * Save data to localStorage
   */
  saveData() {
    try {
      localStorage.setItem("useCases", JSON.stringify(this.useCases));
      console.log("💾 Data saved successfully");
    } catch (error) {
      console.error("❌ Error saving data:", error);
      showAlert("Error saving data. Please try again.", "danger");
    }
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabName = e.target.getAttribute("data-tab");
        this.showTab(tabName, e.target);
      });
    });

    // Form submission
    const form = document.getElementById("useCaseForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveUseCase();
      });

      // Track form changes
      form.addEventListener("input", () => {
        this.isDirty = true;
      });
    }

    // Slider updates
    document.querySelectorAll(".score-slider").forEach((slider) => {
      slider.addEventListener("input", (e) => {
        this.updateScore(e.target.id);
        this.calculateTotalScores();
      });
    });

    // Clear form button
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearForm());
    }

    // Export buttons
    const exportSummaryBtn = document.getElementById("exportSummaryBtn");
    const exportJson = document.getElementById("exportJson");
    const exportCsv = document.getElementById("exportCsv");
    const importBtn = document.getElementById("importBtn");
    const importFile = document.getElementById("importFile");
    const clearAllBtn = document.getElementById("clearAllBtn");

    if (exportSummaryBtn) {
      exportSummaryBtn.addEventListener("click", () =>
        this.exportSummaryReport()
      );
    }
    if (exportJson) {
      exportJson.addEventListener("click", () => this.exportData("json"));
    }
    if (exportCsv) {
      exportCsv.addEventListener("click", () => this.exportData("csv"));
    }
    if (importBtn) {
      importBtn.addEventListener("click", () => importFile.click());
    }
    if (importFile) {
      importFile.addEventListener("change", (e) => this.importData(e));
    }
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => this.clearAllData());
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            this.saveUseCase();
            break;
          case "n":
            e.preventDefault();
            this.clearForm();
            this.showTab("entry");
            break;
        }
      }
    });

    // Warn before leaving if unsaved changes
    window.addEventListener("beforeunload", (e) => {
      if (this.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    });
  }

  /**
   * Initialize slider displays
   */
  initializeSliders() {
    document.querySelectorAll(".score-slider").forEach((slider) => {
      slider.value = 0; // Set default to 0
      this.updateScore(slider.id);
    });
    this.calculateTotalScores();
  }

  /**
   * Update score display for a slider
   */
  updateScore(scoreId) {
    const slider = document.getElementById(scoreId);
    const display = document.getElementById(scoreId + "Display");

    if (slider && display) {
      display.textContent = slider.value;
    }
  }

  /**
   * Calculate and display total scores
   */
  calculateTotalScores() {
    const scores = this.getFormScores();

    const businessValue = calculateBusinessValue(scores);
    const feasibility = calculateFeasibility(scores);

    // Update displays
    const businessDisplay = document.getElementById("totalBusinessValue");
    const feasibilityDisplay = document.getElementById("totalFeasibility");

    if (businessDisplay) businessDisplay.textContent = businessValue;
    if (feasibilityDisplay) feasibilityDisplay.textContent = feasibility;

    // Update quadrant preview
    const quadrant = getQuadrant(businessValue, feasibility);
    const quadrantPreview = document.getElementById("quadrantPreview");
    if (quadrantPreview) {
      quadrantPreview.textContent = quadrant;
      quadrantPreview.style.backgroundColor = getQuadrantColor(quadrant);
    }
  }

  /**
   * Get current form score values
   */
  getFormScores() {
    return {
      economicImpact: document.getElementById("economicImpact")?.value || 0,
      hsec: document.getElementById("hsec")?.value || 0,
      esg: document.getElementById("esg")?.value || 0,
      productivity: document.getElementById("productivity")?.value || 0,
      dataReadiness: document.getElementById("dataReadiness")?.value || 0,
      technicalComplexity:
        document.getElementById("technicalComplexity")?.value || 0,
      aiComplexity: document.getElementById("aiComplexity")?.value || 0,
      organisationalCapability:
        document.getElementById("organisationalCapability")?.value || 0,
    };
  }
  /**
   * Show specific tab
   */
  showTab(tabName, clickedButton = null) {
    console.log(`🔄 Switching to tab: ${tabName}`);

    // Hide all tabs
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.remove("active");
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
      selectedTab.classList.add("active");
    }

    // Update active tab button
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.classList.remove("active");
    });

    if (clickedButton) {
      clickedButton.classList.add("active");
    }

    // Update content based on tab
    setTimeout(() => {
      switch (tabName) {
        case "dashboard":
          this.updateDashboard();
          break;
        case "matrix":
          this.updateMatrix();
          break;
        case "export":
          this.updateExportOptions();
          break;
      }
    }, 50);
  }

  /**
   * Save use case (create or update)
   */
  saveUseCase() {
    try {
      const formData = this.getFormData();

      if (!this.validateForm(formData)) {
        showAlert("Please fill in all required fields.", "warning");
        return;
      }

      const scores = this.getFormScores();
      const businessValue = calculateBusinessValue(scores);
      const feasibility = calculateFeasibility(scores);
      const quadrant = getQuadrant(businessValue, feasibility);

      const useCase = {
        ...formData,
        ...scores,
        businessValue,
        feasibility,
        quadrant,
        timestamp:
          this.editingIndex >= 0
            ? this.useCases[this.editingIndex].timestamp
            : new Date().toISOString(),
        lastModified: new Date().toISOString(),
        id:
          this.editingIndex >= 0
            ? this.useCases[this.editingIndex].id
            : Date.now(),
      };

      if (this.editingIndex >= 0) {
        // Update existing
        this.useCases[this.editingIndex] = useCase;
        this.editingIndex = -1;
        showAlert("Use case updated successfully!", "success");
      } else {
        // Create new
        this.useCases.push(useCase);
        showAlert("Use case saved successfully!", "success");
      }

      this.saveData();
      this.clearForm();
      this.updateAllViews();
      this.isDirty = false;
    } catch (error) {
      console.error("❌ Error saving use case:", error);
      showAlert("Error saving use case. Please try again.", "danger");
    }
  }

  /**
   * Get form data
   */
  getFormData() {
    const fields = [
      "useCaseTitle",
      "businessProcess",
      "painPoints",
      "opportunities",
      "piiConsiderations",
      "dataAvailability",
      "aiImpact",
      "additionalInformation",
    ];

    const data = {};
    fields.forEach((field) => {
      const element = document.getElementById(field);
      if (element) {
        data[field] = element.value.trim();
      }
    });

    return data;
  }

  /**
   * Validate form data
   */
  validateForm(formData) {
    const required = [
      "useCaseTitle",
      "businessProcess",
      "painPoints",
      "opportunities",
      "piiConsiderations",
      "dataAvailability",
      "aiImpact",
    ];

    return required.every(
      (field) => formData[field] && formData[field].length > 0
    );
  }

  /**
   * Clear form
   */
  clearForm() {
    const form = document.getElementById("useCaseForm");
    if (form) {
      form.reset();
    }

    // Reset sliders to 0
    document.querySelectorAll(".score-slider").forEach((slider) => {
      slider.value = 0;
      this.updateScore(slider.id);
    });

    this.calculateTotalScores();
    this.editingIndex = -1;
    this.isDirty = false;
  }

  /**
   * Edit use case
   */
  editUseCase(index) {
    if (index < 0 || index >= this.useCases.length) return;

    const useCase = this.useCases[index];
    this.editingIndex = index;

    // Populate form fields
    Object.keys(useCase).forEach((key) => {
      const element = document.getElementById(key);
      if (element) {
        element.value = useCase[key] || "";
        if (element.classList.contains("score-slider")) {
          this.updateScore(key);
        }
      }
    });

    this.calculateTotalScores();
    this.showTab("entry");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showAlert("Use case loaded for editing.", "info");
  }

  /**
   * Delete use case
   */
  deleteUseCase(index) {
    if (index < 0 || index >= this.useCases.length) return;

    const useCase = this.useCases[index];
    if (confirm(`Are you sure you want to delete "${useCase.useCaseTitle}"?`)) {
      this.useCases.splice(index, 1);
      this.saveData();
      this.updateAllViews();
      showAlert("Use case deleted successfully.", "success");
    }
  }

  /**
   * Update all views
   */
  updateAllViews() {
    this.updateDashboard();
    this.updateMatrix();
    this.updateExportOptions();
  }
  /**
   * Update dashboard
   */
  updateDashboard() {
    // Update stats - only total count now
    const totalElement = document.getElementById("totalUseCases");
    if (totalElement) {
      totalElement.textContent = this.useCases.length;
    }

    // Update use cases list
    const listElement = document.getElementById("useCasesList");
    if (!listElement) return;

    listElement.innerHTML = "";

    if (this.useCases.length === 0) {
      listElement.innerHTML =
        '<p class="text-muted">No use cases created yet. Go to Data Entry to create your first use case!</p>';
      return;
    }

    this.useCases.forEach((useCase, index) => {
      const item = document.createElement("div");
      item.className = "use-case-item";

      // Use new field names, fallback to old ones for backward compatibility
      const painPoints = useCase.painPoints || useCase.problemStatement || "";

      item.innerHTML = `
            <div class="use-case-header">
            <div>
                <div class="use-case-title">${useCase.useCaseTitle}</div>
                <div class="use-case-meta">
                <span class="quadrant-badge" style="background: ${getQuadrantColor(
                  useCase.quadrant
                )}">
                    ${useCase.quadrant || "Not categorized"}
                </span>
                Value: ${useCase.businessValue}/5 | Feasibility: ${
        useCase.feasibility
      }/5
                </div>
                <p>${truncateText(painPoints, 150)}</p>
            </div>
            <div class="use-case-actions">
                <button class="btn btn-info" onclick="app.editUseCase(${index})">Edit</button>
                <button class="btn btn-danger" onclick="app.deleteUseCase(${index})">Delete</button>
            </div>
            </div>
        `;

      listElement.appendChild(item);
    });
  }
  /**
   * Update matrix visualization
   */

  updateMatrix() {
    const matrix = document.getElementById("priorityMatrix");
    if (!matrix) {
      console.error("Matrix element not found");
      return;
    }

    console.log(`🎯 Updating matrix with ${this.useCases.length} use cases`);

    // Clear existing points
    const existingPoints = matrix.querySelectorAll(".matrix-point");
    existingPoints.forEach((point) => point.remove());

    // Track positions to handle overlaps
    const positionMap = new Map();

    // Add points for each use case
    this.useCases.forEach((useCase, index) => {
      const businessValue = parseFloat(useCase.businessValue);
      const feasibility = parseFloat(useCase.feasibility);

      console.log(
        `Use case ${index + 1}: "${
          useCase.useCaseTitle
        }" - Value: ${businessValue}, Feasibility: ${feasibility}`
      );

      // Check for invalid values
      if (isNaN(businessValue) || isNaN(feasibility)) {
        console.warn(
          `⚠️ Invalid scores for "${useCase.useCaseTitle}": Value=${useCase.businessValue}, Feasibility=${useCase.feasibility}`
        );
        return; // Skip this use case
      }

      const point = document.createElement("div");
      point.className = "matrix-point";

      // Calculate base position (convert 1-10 scale to percentage)
      let x = (feasibility / 5) * 100;
      let y = 100 - (businessValue / 5) * 100; // Invert Y axis

      // Create position key for overlap detection
      const positionKey = `${Math.round(x * 10)}-${Math.round(y * 10)}`;

      // Handle overlapping points by adding small offsets
      if (positionMap.has(positionKey)) {
        const existingCount = positionMap.get(positionKey);
        const offsetAngle = existingCount * 45 * (Math.PI / 180); // 45 degrees apart
        const offsetDistance = 3; // 3% offset

        x += Math.cos(offsetAngle) * offsetDistance;
        y += Math.sin(offsetAngle) * offsetDistance;

        positionMap.set(positionKey, existingCount + 1);
        console.log(
          `📍 Offset applied to "${
            useCase.useCaseTitle
          }" - New position: x=${x.toFixed(1)}%, y=${y.toFixed(1)}%`
        );
      } else {
        positionMap.set(positionKey, 1);
      }

      // Ensure points stay within bounds
      x = Math.max(2, Math.min(98, x));
      y = Math.max(2, Math.min(98, y));

      console.log(
        `Position for "${useCase.useCaseTitle}": x=${x.toFixed(
          1
        )}%, y=${y.toFixed(1)}%`
      );

      // Create tooltip with multiple use cases if overlapping
      const overlappingCases = this.useCases.filter((uc) => {
        const ucX = ((parseFloat(uc.feasibility) - 1) / 9) * 100;
        const ucY = 100 - ((parseFloat(uc.businessValue) - 1) / 9) * 100;
        return (
          Math.abs(ucX - ((feasibility - 1) / 9) * 100) < 1 &&
          Math.abs(ucY - (100 - ((businessValue - 1) / 9) * 100)) < 1
        );
      });

      if (overlappingCases.length > 1) {
        const tooltipText = overlappingCases
          .map(
            (uc) =>
              `${uc.useCaseTitle} (Value: ${uc.businessValue}, Feasibility: ${uc.feasibility})`
          )
          .join("\n");
        point.title = tooltipText;

        // Add visual indicator for multiple points
        point.style.border = "3px solid #fff";
        point.style.boxShadow =
          "0 0 0 2px var(--primary-color), 0 2px 8px rgba(0,0,0,0.2)";
      } else {
        point.title = `${useCase.useCaseTitle}\nValue: ${businessValue}, Feasibility: ${feasibility}`;
      }

      point.style.left = x + "%";
      point.style.top = y + "%";
      point.style.backgroundColor = getQuadrantColor(useCase.quadrant);

      point.addEventListener("click", () => {
        this.editUseCase(index);
      });

      matrix.appendChild(point);
      console.log(`✅ Added point for "${useCase.useCaseTitle}"`);
    });

    console.log(
      `🎯 Matrix update complete. Points in DOM: ${
        matrix.querySelectorAll(".matrix-point").length
      }`
    );
  }
  /**
   * Update export options
   */
  updateExportOptions() {
    const listElement = document.getElementById("individualExportList");
    if (!listElement) return;

    listElement.innerHTML = "";

    if (this.useCases.length === 0) {
      listElement.innerHTML =
        '<p class="text-muted">No use cases available for export.</p>';
      return;
    }

    this.useCases.forEach((useCase, index) => {
      const item = document.createElement("div");
      item.className = "export-item";
      item.innerHTML = `
            <span>${useCase.useCaseTitle}</span>
            <button class="btn btn-info" onclick="app.exportUseCase(${index})">Export HTML</button>
        `;
      listElement.appendChild(item);
    });
  }

  /**
   * Export data in various formats
   */
  exportData(format) {
    if (this.useCases.length === 0) {
      showAlert("No data to export!", "info");
      return;
    }

    try {
      switch (format) {
        case "json":
          const jsonData = JSON.stringify(this.useCases, null, 2);
          downloadFile(jsonData, "use-cases.json", "application/json");
          break;

        case "csv":
          const csvData = generateCSV(this.useCases);
          downloadFile(csvData, "use-cases.csv", "text/csv");
          break;
      }

      showAlert(
        `Data exported successfully as ${format.toUpperCase()}!`,
        "success"
      );
    } catch (error) {
      console.error("Export error:", error);
      showAlert("Error exporting data. Please try again.", "danger");
    }
  }

  /**
   * Export comprehensive summary report
   */
  exportSummaryReport() {
    if (this.useCases.length === 0) {
      showAlert("No data to export!", "info");
      return;
    }

    try {
      const htmlContent = this.generateSummaryReport();
      const filename = `agentic-ai-summary-report-${
        new Date().toISOString().split("T")[0]
      }.html`;
      downloadFile(htmlContent, filename, "text/html");
      showAlert("Summary report exported successfully!", "success");
    } catch (error) {
      console.error("Summary report export error:", error);
      showAlert("Error generating summary report. Please try again.", "danger");
    }
  }

  /**
   * Generate comprehensive summary report HTML
   */
  generateSummaryReport() {
    // Calculate statistics
    const totalUseCases = this.useCases.length;
    const avgBusinessValue = (
      this.useCases.reduce(
        (sum, uc) => sum + parseFloat(uc.businessValue || 0),
        0
      ) / totalUseCases
    ).toFixed(1);
    const avgFeasibility = (
      this.useCases.reduce(
        (sum, uc) => sum + parseFloat(uc.feasibility || 0),
        0
      ) / totalUseCases
    ).toFixed(1);

    // Group by quadrants
    const quadrants = {
      "Quick Wins": [],
      "Strategic Initiatives": [],
      "Incremental Improvements": [],
      Deprioritize: [],
    };

    this.useCases.forEach((uc) => {
      const quadrant = uc.quadrant || "Deprioritize";
      if (quadrants[quadrant]) {
        quadrants[quadrant].push(uc);
      }
    });

    const quickWinsCount = quadrants["Quick Wins"].length;
    const currentDate = formatDate(new Date());

    return `<!DOCTYPE html>
<html>
<head>
    <title>Agentic AI Use Cases - Summary Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { width: 100px; height: auto; margin-bottom: 15px; }
        .summary-stats { display: flex; justify-content: space-around; background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .stat-item { text-align: center; }
        .stat-value { font-size: 28px; font-weight: bold; color: #667eea; }
        .quadrant-section { margin: 30px 0; }
        .quadrant-title { color: #667eea; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
        .use-case-summary { background: #f8f9fa; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
        .use-case-title { font-weight: bold; color: #495057; margin-bottom: 5px; }
        .use-case-scores { font-size: 14px; color: #6c757d; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
        th { background: #667eea; color: white; }
        .page-break { page-break-before: always; }
        @media print { 
            body { margin: 20px; } 
            .page-break { page-break-before: always; }
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="assets/logo.png" alt="Company Logo" class="logo">
        <h1>Agentic AI Use Cases</h1>
        <h2>Executive Summary Report</h2>
        <p>Generated on ${currentDate} | Total Use Cases: ${totalUseCases}</p>
    </div>
    
    <div class="summary-stats">
        <div class="stat-item">
            <div class="stat-value">${totalUseCases}</div>
            <div>Total Use Cases</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${avgBusinessValue}</div>
            <div>Avg Business Value</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${avgFeasibility}</div>
            <div>Avg Feasibility</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${quickWinsCount}</div>
            <div>Quick Wins</div>
        </div>
    </div>

    ${this.generateQuadrantSections(quadrants)}
    
    <div class="page-break"></div>
    <h2>Detailed Use Cases Overview</h2>
    <table>
    <thead>
        <tr>
            <th>Use Case</th>
            <th>Business Process</th>
            <th>Business Value</th>
            <th>Feasibility</th>
            <th>Priority</th>
        </tr>
    </thead>
    <tbody>
        ${this.useCases
          .map(
            (uc) => `
            <tr>
                <td><strong>${uc.useCaseTitle}</strong></td>
                <td>${uc.businessProcess || uc.valueChain || ""}</td>
                <td>${uc.businessValue}</td>
                <td>${uc.feasibility}</td>
                <td style="background: ${getQuadrantColor(
                  uc.quadrant
                )}20; color: ${getQuadrantColor(uc.quadrant)};">${
              uc.quadrant
            }</td>
            </tr>
        `
          )
          .join("")}
    </tbody>
</table>
    
    <div class="page-break"></div>
    <h2>Implementation Roadmap Recommendations</h2>
    
    ${this.generateRoadmapRecommendations(quadrants)}
    
</body>
</html>`;
  }

  /**
   * Generate quadrant sections for summary report
   */
  generateQuadrantSections(quadrants) {
    let html = "";

    Object.entries(quadrants).forEach(([quadrantName, useCases]) => {
      if (useCases.length > 0) {
        const color = getQuadrantColor(quadrantName);
        html += `
                    <div class="quadrant-section">
                        <div class="quadrant-title" style="color: ${color};">${quadrantName} (${
          useCases.length
        } use cases)</div>
                        ${useCases
                          .map((uc) => {
                            // Use new field names, fallback to old ones
                            const painPoints =
                              uc.painPoints || uc.problemStatement || "";
                            return `
                            <div class="use-case-summary" style="border-left-color: ${color};">
                                <div class="use-case-title">${
                                  uc.useCaseTitle
                                }</div>
                                <div class="use-case-scores">Business Value: ${
                                  uc.businessValue
                                } | Feasibility: ${uc.feasibility}</div>
                                <div style="margin-top: 8px; font-size: 13px;">${truncateText(
                                  painPoints,
                                  100
                                )}</div>
                            </div>
                          `;
                          })
                          .join("")}
                    </div>
                    `;
      }
    });

    return html;
  }

  /**
   * Generate roadmap recommendations
   */
  generateRoadmapRecommendations(quadrants) {
    let html = "";

    if (quadrants["Quick Wins"].length > 0) {
      html += `
                <h3>Phase 1: Quick Wins (0-6 months)</h3>
                <p>Focus on high-value, high-feasibility use cases for immediate impact:</p>
                <ul>
                    ${quadrants["Quick Wins"]
                      .map(
                        (uc) =>
                          `<li><strong>${uc.useCaseTitle}</strong> - ${
                            uc.financialImpact || "Impact TBD"
                          }</li>`
                      )
                      .join("")}
                </ul>
                `;
    }

    if (quadrants["Strategic Initiatives"].length > 0) {
      html += `
                <h3>Phase 2: Strategic Initiatives (6-24 months)</h3>
                <p>Invest in transformative use cases that require significant planning and resources:</p>
                <ul>
                    ${quadrants["Strategic Initiatives"]
                      .map(
                        (uc) =>
                          `<li><strong>${uc.useCaseTitle}</strong> - ${
                            uc.financialImpact || "Impact TBD"
                          }</li>`
                      )
                      .join("")}
                </ul>
                `;
    }

    html += `
                <h3>Key Success Factors</h3>
                <ul>
                    <li>Establish clear success metrics and KPIs for each implementation</li>
                    <li>Ensure adequate data infrastructure and quality</li>
                    <li>Invest in change management and training</li>
                    <li>Start with pilot projects to validate assumptions</li>
                    <li>Build internal AI/automation capabilities</li>
                </ul>
            `;

    return html;
  }

  /**
   * Export individual use case as HTML
   */
  exportUseCase(index) {
    if (index < 0 || index >= this.useCases.length) return;

    const useCase = this.useCases[index];
    const htmlContent = this.generateUseCaseHTML(useCase);
    const filename = `${useCase.useCaseTitle
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.html`;

    downloadFile(htmlContent, filename, "text/html");
    showAlert("Use case exported successfully!", "success");
  }

  /**
   * Generate HTML report for use case
   */
  generateUseCaseHTML(useCase) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Use Case Report: ${useCase.useCaseTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #3a165e; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h3 { color: #3a165e; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .scores { display: flex; justify-content: space-around; background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .score-item { text-align: center; }
        .score-value { font-size: 24px; font-weight: bold; color: #3a165e; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Use Case Assessment Report</h1>
        <h2>${useCase.useCaseTitle}</h2>
        <p>Generated on ${formatDate(new Date())}</p>
    </div>

    <div class="section">
        <h3>Overview</h3>
        <p><strong>Business Process:</strong> ${
          useCase.businessProcess || useCase.valueChain || ""
        }</p>
        <p><strong>Pain Points:</strong> ${
          useCase.painPoints || useCase.problemStatement || ""
        }</p>
        <p><strong>Opportunities:</strong> ${
          useCase.opportunities || useCase.rootCause || ""
        }</p>
    </div>

    <div class="section">
        <h3>Assessment Scores</h3>
        <div class="scores">
            <div class="score-item">
                <div class="score-value">${useCase.businessValue}</div>
                <div>Business Value</div>
            </div>
            <div class="score-item">
                <div class="score-value">${useCase.feasibility}</div>
                <div>Feasibility</div>
            </div>
            <div class="score-item">
                <div class="score-value">${useCase.quadrant}</div>
                <div>Priority Category</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>Implementation Details</h3>
        <p><strong>Data Availability:</strong> ${useCase.dataAvailability}</p>
        <p><strong>AI Impact:</strong> ${
          useCase.aiImpact || useCase.potentialSolution || ""
        }</p>
        <p><strong>PII Considerations:</strong> ${
          useCase.piiConsiderations || useCase.regulatory || ""
        }</p>
    </div>
</body>
</html>`;
  }
  /**
   * Import data from file
   */
  importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        console.log("📥 Import data received:", data);

        // Handle both array and object formats
        let useCases = Array.isArray(data) ? data : data.useCases || [];

        if (!Array.isArray(useCases) || useCases.length === 0) {
          throw new Error("No valid use cases found in file");
        }

        // Validate and migrate each use case
        const validUseCases = [];
        useCases.forEach((useCase, index) => {
          console.log(`📋 Processing use case ${index + 1}:`, useCase);

          // Check if it has a title (required field)
          if (!useCase.useCaseTitle || useCase.useCaseTitle.trim() === "") {
            console.warn(`⚠️ Skipping use case ${index + 1}: No title`);
            return;
          }

          // Migrate old field names to new ones (backward compatibility)
          const migratedUseCase = this.migrateUseCaseFields(useCase);
          validUseCases.push(migratedUseCase);
        });

        if (validUseCases.length === 0) {
          throw new Error("No valid use cases found in file");
        }

        // Confirm import
        const confirmMessage = `Import ${validUseCases.length} use case(s)? This will replace all existing data.`;
        if (confirm(confirmMessage)) {
          this.useCases = validUseCases;
          localStorage.setItem("useCases", JSON.stringify(this.useCases));
          this.updateAllViews();
          showAlert(
            `Successfully imported ${validUseCases.length} use case(s)!`,
            "success"
          );
          console.log("✅ Import completed successfully");
        }
      } catch (error) {
        console.error("❌ Import error:", error);
        showAlert(`Import failed: ${error.message}`, "danger");
      }

      // Reset file input
      event.target.value = "";
    };

    reader.readAsText(file);
  }

  /**
   * Migrate old field names to new field names for backward compatibility
   */
  migrateUseCaseFields(useCase) {
    const migrated = { ...useCase };

    // Field name migrations (old -> new)
    const fieldMigrations = {
      valueChain: "businessProcess",
      problemStatement: "painPoints",
      rootCause: "opportunities",
      regulatory: "piiConsiderations",
      potentialSolution: "aiImpact",
      estimatedCost: "additionalInformation", // Merge old cost info
      timeToComplete: "additionalInformation", // Merge old time info
    };

    // Apply field migrations
    Object.entries(fieldMigrations).forEach(([oldField, newField]) => {
      if (useCase[oldField] && !migrated[newField]) {
        migrated[newField] = useCase[oldField];
      }
    });

    // Special handling for additionalInformation - combine old cost and time fields
    if (useCase.estimatedCost || useCase.timeToComplete) {
      const additionalParts = [];
      if (useCase.estimatedCost)
        additionalParts.push(`Cost: ${useCase.estimatedCost}`);
      if (useCase.timeToComplete)
        additionalParts.push(`Time: ${useCase.timeToComplete}`);

      if (additionalParts.length > 0) {
        const existingAdditional = migrated.additionalInformation || "";
        migrated.additionalInformation = existingAdditional
          ? `${existingAdditional}\n\n${additionalParts.join(", ")}`
          : additionalParts.join(", ");
      }
    }

    // Ensure required fields have defaults
    const requiredDefaults = {
      useCaseTitle: migrated.useCaseTitle || "Untitled Use Case",
      businessProcess: migrated.businessProcess || "",
      painPoints: migrated.painPoints || "",
      opportunities: migrated.opportunities || "",
      piiConsiderations: migrated.piiConsiderations || "",
      dataAvailability: migrated.dataAvailability || "",
      aiImpact: migrated.aiImpact || "",
      additionalInformation: migrated.additionalInformation || "",
      businessValue: migrated.businessValue || 0,
      feasibility: migrated.feasibility || 0,
      quadrant: migrated.quadrant || "Deprioritize",
      timestamp: migrated.timestamp || new Date().toISOString(),
    };

    // Apply defaults for missing fields
    Object.entries(requiredDefaults).forEach(([field, defaultValue]) => {
      if (!migrated[field]) {
        migrated[field] = defaultValue;
      }
    });

    console.log("🔄 Migrated use case:", migrated);
    return migrated;
  }

  /**
   * Set up auto-save functionality
   */
  setupAutoSave() {
    // Auto-save form data every 30 seconds
    setInterval(() => {
      if (this.isDirty) {
        const formData = this.getFormData();
        if (formData.useCaseTitle && formData.useCaseTitle.length > 0) {
          localStorage.setItem(
            "autoSaveData",
            JSON.stringify({
              ...formData,
              ...this.getFormScores(),
              timestamp: new Date().toISOString(),
            })
          );
        }
      }
    }, 30000);

    // Check for auto-saved data on load
    window.addEventListener("load", () => {
      const autoSaveData = localStorage.getItem("autoSaveData");
      if (autoSaveData) {
        try {
          const data = JSON.parse(autoSaveData);
          if (
            data.useCaseTitle &&
            confirm("Restore previously entered data?")
          ) {
            // Populate form with auto-saved data
            Object.keys(data).forEach((key) => {
              const element = document.getElementById(key);
              if (element && data[key]) {
                element.value = data[key];
                if (element.classList.contains("score-slider")) {
                  this.updateScore(key);
                }
              }
            });
            this.calculateTotalScores();
            localStorage.removeItem("autoSaveData");
            showAlert("Auto-saved data restored!", "info");
          }
        } catch (error) {
          console.error("Auto-save restore error:", error);
          localStorage.removeItem("autoSaveData");
        }
      }
    });
  }

  /**
   * Clear all data
   */
  clearAllData() {
    if (
      confirm(
        "Are you sure you want to delete ALL use cases? This action cannot be undone."
      )
    ) {
      this.useCases = [];
      localStorage.removeItem("useCases");
      localStorage.removeItem("autoSaveData");
      this.clearForm();
      this.updateAllViews();
      showAlert("All data cleared successfully!", "success");
    }
  }
}

// Global functions for backward compatibility with onclick handlers
window.app = null;

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new UseCaseApp();
  console.log("🎉 AI Use Case Assessment Tool ready!");
});

// Export for potential module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = UseCaseApp;
}
