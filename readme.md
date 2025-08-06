# Agentic AI Use Case Assessment Tool

A comprehensive web-based application for evaluating, prioritizing, and managing AI/automation use cases within organizations. This tool helps teams systematically assess potential AI implementations using a structured scoring framework and priority matrix visualization.

## 🚀 Features

### Core Functionality

- **📝 Data Entry Form**: Comprehensive use case capture with descriptive information and quantitative scoring
- **🎯 Priority Matrix**: Interactive visualization plotting Business Value vs Implementation Feasibility
- **📊 Dashboard**: Overview statistics and use case management
- **📄 Export System**: Multiple export formats (JSON, CSV, HTML reports, Executive Summary)
- **📥 Import/Export**: Data portability with backward compatibility
- **💾 Auto-Save**: Local storage persistence with auto-save functionality

### Scoring Framework

**Business Value Components (0-5 scale):**

- Economic Impact
- HSEC (Health, Safety, Environment, Community)
- ESG (Environmental, Social, Governance)
- Productivity

**Implementation Feasibility Components (0-5 scale):**

- Data Readiness
- Technical Complexity (reverse scored)
- AI Complexity (reverse scored)
- Organizational Capability Readiness

### Priority Quadrants

- **🟢 Quick Wins**: High Value, High Feasibility
- **🟡 Strategic Initiatives**: High Value, Low Feasibility
- **🔵 Incremental Improvements**: Low Value, High Feasibility
- **🔴 Deprioritize**: Low Value, Low Feasibility

## 📋 Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Setup

1. **Download/Clone the project files**

   ```bash
   git clone [repository-url]
   # OR download and extract the ZIP file
   ```

2. **File Structure**

   ```
   AIUSECASEASSESSMENT/
   ├── index.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   ├── app.js
   │   └── utils.js
   ├── assets/
   │   └── logo.png (optional)
   └── README.md
   ```

3. **Launch the Application**
   - Simply open `index.html` in your web browser
   - No installation or server setup required
   - Works offline once loaded

## 📖 Usage Guide

### Getting Started

1. **Open the Application**

   - Double-click `index.html` or open it in your browser
   - The application loads with the Data Entry tab active

2. **Create Your First Use Case**

   - Fill in the **Descriptive Information** section:
     - Use Case Title (required)
     - Business Process (required)
     - Pain Points (required)
     - Opportunities (required)
     - PII Considerations (required)
     - Data Availability & Quality (required)
     - AI Impact (required)
   - Add any **Additional Information** as needed

3. **Score the Use Case**

   - Use the sliders to rate each component (0-5 scale)
   - Watch the calculated scores update in real-time
   - See the quadrant classification preview
   - NOTE: Technical complexity and AI complexity are scored in reverse
     - Lower complexity = higher feasibility and vice versa

4. **Save the Use Case**
   - Click "💾 Save Use Case"
   - Data is automatically saved to browser storage

### Navigation

#### 📝 Data Entry Tab

- Create new use cases
- Edit existing use cases
- Auto-save functionality
- Form validation

#### 📊 Dashboard Tab

- View total use cases count
- Browse all use cases
- Quick edit/delete actions
- Search and filter (future enhancement)

#### 🎯 Matrix Tab

- Interactive priority matrix visualization
- Click points to edit use cases
- Color-coded quadrants
- Handles overlapping points automatically

#### 📄 Export Tab

- **Summary Report**: Professional executive summary with implementation roadmap
- **Export JSON**: Complete data backup
- **Export CSV**: Spreadsheet-friendly format
- **Individual Reports**: Detailed HTML reports per use case
- **Import Data**: Restore from JSON backup
- **Clear All Data**: Reset application

### Advanced Features

#### Data Management

- **Auto-Save**: Changes saved automatically every 30 seconds
- **Import/Export**: Full data portability
- **Backward Compatibility**: Handles old data formats
- **Local Storage**: No data leaves your browser

#### Scoring Logic

- Business Value: Average of 4 components
- Implementation Feasibility: Average with complexity reverse-scored
- Quadrant Threshold: 2.5 (middle of 0-5 scale)

#### Export Formats

- **JSON**: Complete data structure for backup/sharing
- **CSV**: Tabular format for spreadsheet analysis
- **HTML Reports**: Professional formatted reports
- **Summary Report**: Executive presentation with charts and roadmap

## 🔧 Customization

### Scoring Components

- Edit component labels in `index.html`
- Adjust scoring logic in `js/utils.js`
- Modify quadrant thresholds as needed

### Export Templates

- Customize HTML report templates in `js/app.js`
- Modify summary report styling
- Add additional export formats

## 🛠️ Technical Details

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Data Storage

- Uses browser localStorage
- No server communication
- Data persists between sessions
- Approximately 5-10MB storage capacity

### Performance

- Handles 100+ use cases efficiently
- Real-time calculations
- Responsive design for mobile/tablet
- Optimized for offline use

## 📊 Data Structure

### Use Case Object

```javascript
{
  useCaseTitle: "string",
  businessProcess: "string",
  painPoints: "string",
  opportunities: "string",
  piiConsiderations: "string",
  dataAvailability: "string",
  aiImpact: "string",
  additionalInformation: "string",
  economicImpact: 0-5,
  hsec: 0-5,
  esg: 0-5,
  productivity: 0-5,
  dataReadiness: 0-5,
  technicalComplexity: 0-5,
  aiComplexity: 0-5,
  organisationalCapability: 0-5,
  businessValue: calculated,
  feasibility: calculated,
  quadrant: "string",
  timestamp: "ISO date"
}
```

## 🚨 Troubleshooting

### Common Issues

**Import Fails**

- Ensure JSON file is valid
- Check file contains `useCaseTitle` field
- Review browser console for detailed errors

**Matrix Points Missing**

- Verify Business Value and Feasibility scores are numbers
- Check browser console for calculation errors
- Overlapping points may appear as one (hover for details)

**Data Not Saving**

- Check browser localStorage is enabled
- Clear browser cache if issues persist
- Export data as backup before troubleshooting

**Export Not Working**

- Ensure pop-up blocker is disabled
- Try different browser if download fails
- Check browser's download settings

### Browser Console

- Press F12 to open developer tools
- Check Console tab for error messages
- Look for detailed logging during operations

## 🔒 Privacy & Security

- **No Data Transmission**: All data stays in your browser
- **Local Storage Only**: No server communication
- **Privacy Compliant**: No tracking or analytics
- **Secure**: No external dependencies or CDNs

## 📞 Support

For technical issues or feature requests:

1. Check browser console for error messages
2. Verify browser compatibility
3. Try clearing browser cache/localStorage
4. Export data before troubleshooting

---

**Version**: 1.0  
**Last Updated**: January 2025  
**License**: [Your License Here]  
**Developed by**: [Your Organization]
