/**
 * Essential Utility Functions
 * Clean, focused helpers for the AI Use Case Assessment Tool
 */

// Alert system
function showAlert(message, type = "info", duration = 5000) {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll(".alert");
  existingAlerts.forEach((alert) => alert.remove());

  // Create new alert
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    ${message}
    <button class="alert-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  // Insert at top of content
  const content = document.querySelector(".content");
  if (content) {
    content.insertBefore(alert, content.firstChild);
  }

  // Auto-remove after duration
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, duration);
}

// File download helper
function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Score calculations
function calculateBusinessValue(scores) {
  const { economicImpact, hsec, esg, productivity } = scores;
  const total =
    (parseInt(economicImpact || 0) +
      parseInt(hsec || 0) +
      parseInt(esg || 0) +
      parseInt(productivity || 0)) /
    4;
  return parseFloat(total.toFixed(1));
}

function calculateFeasibility(scores) {
  const {
    dataReadiness,
    technicalComplexity,
    aiComplexity,
    organisationalCapability,
  } = scores;

  // Technical and AI complexity are reverse scored (higher complexity = lower feasibility)
  const reversedTechnicalComplexity = 5 - parseInt(technicalComplexity || 0);
  const reversedAiComplexity = 5 - parseInt(aiComplexity || 0);

  const total =
    (parseInt(dataReadiness || 0) +
      reversedTechnicalComplexity +
      reversedAiComplexity +
      parseInt(organisationalCapability || 0)) /
    4;

  return parseFloat(total.toFixed(1));
}

// Quadrant determination (updated thresholds for 0-5 scale)
function getQuadrant(businessValue, feasibility) {
  const threshold = 2.5; // Middle of 0-5 scale

  if (businessValue >= threshold && feasibility >= threshold) {
    return "Quick Wins";
  }
  if (businessValue >= threshold && feasibility < threshold) {
    return "Strategic Initiatives";
  }
  if (businessValue < threshold && feasibility >= threshold) {
    return "Incremental Improvements";
  }
  return "Deprioritize";
}

// Quadrant colors
function getQuadrantColor(quadrant) {
  const colors = {
    "Quick Wins": "#28a745",
    "Strategic Initiatives": "#ffc107",
    "Incremental Improvements": "#17a2b8",
    Deprioritize: "#dc3545",
  };
  return colors[quadrant] || "#6c757d";
}

// Format date for display
function formatDate(date) {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
}

// Truncate text
function truncateText(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

// Generate CSV from use cases
function generateCSV(useCases) {
  const headers = [
    "Title",
    "Business Process",
    "Pain Points",
    "Business Value",
    "Feasibility",
    "Quadrant",
    "Created Date",
  ];

  let csv = headers.join(",") + "\n";

  useCases.forEach((useCase) => {
    const row = [
      `"${useCase.useCaseTitle || ""}"`,
      `"${useCase.businessProcess || ""}"`,
      `"${(useCase.painPoints || "").replace(/"/g, '""')}"`,
      useCase.businessValue || "",
      useCase.feasibility || "",
      `"${useCase.quadrant || ""}"`,
      `"${formatDate(useCase.timestamp)}"`,
    ];
    csv += row.join(",") + "\n";
  });

  return csv;
}

// Simple debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
