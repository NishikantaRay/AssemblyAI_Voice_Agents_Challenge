const AnalyticsPage = () => (
  <div className="dashboard-content">
    <div className="page-header">
      <h2 className="page-title">Analytics & Reports</h2>
      <div className="page-actions">
        <button className="btn-secondary">Export Report</button>
        <button className="btn-primary">Generate Report</button>
      </div>
    </div>

    <div className="analytics-grid">
      <div className="analytics-card">
        <div className="analytics-header">
          <h3 className="analytics-title">Application Success Rate</h3>
          <span className="analytics-period">Last 30 days</span>
        </div>
        <div className="analytics-chart">
          <div className="donut-chart">
            <div className="donut-center">
              <span className="donut-percentage">87.3%</span>
              <span className="donut-label">Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-header">
          <h3 className="analytics-title">Voice Input Usage</h3>
          <span className="analytics-period">This month</span>
        </div>
        <div className="analytics-metrics">
          <div className="metric">
            <span className="metric-value">12,847</span>
            <span className="metric-label">Voice Sessions</span>
          </div>
          <div className="metric">
            <span className="metric-value">94.2%</span>
            <span className="metric-label">Accuracy Rate</span>
          </div>
          <div className="metric">
            <span className="metric-value">2.3s</span>
            <span className="metric-label">Avg Response Time</span>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <div className="analytics-header">
          <h3 className="analytics-title">Processing Times</h3>
          <span className="analytics-period">Weekly average</span>
        </div>
        <div className="time-chart">
          <div className="time-bar">
            <span className="time-label">Voice Input</span>
            <div className="time-progress" style={{ width: "30%" }}></div>
            <span className="time-value">1.2 min</span>
          </div>
          <div className="time-bar">
            <span className="time-label">Document Upload</span>
            <div className="time-progress" style={{ width: "60%" }}></div>
            <span className="time-value">2.4 min</span>
          </div>
          <div className="time-bar">
            <span className="time-label">Review Process</span>
            <div className="time-progress" style={{ width: "80%" }}></div>
            <span className="time-value">3.2 min</span>
          </div>
        </div>
      </div>
    </div>

    <div className="reports-section">
      <h3 className="section-title">Recent Reports</h3>
      <div className="reports-list">
        <div className="report-item">
          <div className="report-icon">📊</div>
          <div className="report-content">
            <h4 className="report-title">Monthly KYC Report</h4>
            <p className="report-description">
              Comprehensive analysis of KYC applications for December 2024
            </p>
            <span className="report-date">Generated on Dec 31, 2024</span>
          </div>
          <div className="report-actions">
            <button className="btn-sm">Download</button>
            <button className="btn-sm">View</button>
          </div>
        </div>

        <div className="report-item">
          <div className="report-icon">🎤</div>
          <div className="report-content">
            <h4 className="report-title">Voice Input Performance</h4>
            <p className="report-description">
              Analysis of voice recognition accuracy and user satisfaction
            </p>
            <span className="report-date">Generated on Dec 28, 2024</span>
          </div>
          <div className="report-actions">
            <button className="btn-sm">Download</button>
            <button className="btn-sm">View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AnalyticsPage;