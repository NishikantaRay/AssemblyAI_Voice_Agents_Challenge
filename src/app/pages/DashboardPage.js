
import statCards from '../data/dashboardStatCards';

const DashboardPage = ({ apiCallCounter, formDataCount }) => (
  <div className="dashboard-content">
    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      {statCards.map((card, idx) => (
        <div className="stat-card" key={idx} style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="stat-card-header" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="stat-card-icon" style={{ fontSize: 22 }}>{card.icon}</span>
            <span className="stat-card-title" style={{ fontWeight: 600 }}>{card.title}</span>
          </div>
          <div className="stat-card-value" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{card.value}</div>
          <div className={`stat-card-change ${card.changeClass}`}>{card.change}</div>
        </div>
      ))}
    </div>

    <div className="dashboard-widgets">
      <div className="widget-row">
        <div className="chart-widget">
          <div className="widget-header">
            <h3 className="widget-title">Application Trends</h3>
          </div>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="chart-bar" style={{height: '60%'}}></div>
              <div className="chart-bar" style={{height: '80%'}}></div>
              <div className="chart-bar" style={{height: '45%'}}></div>
              <div className="chart-bar" style={{height: '90%'}}></div>
              <div className="chart-bar" style={{height: '70%'}}></div>
              <div className="chart-bar" style={{height: '85%'}}></div>
              <div className="chart-bar" style={{height: '75%'}}></div>
            </div>
            <p className="chart-label">Weekly application submissions</p>
          </div>
        </div>
        
        <div className="activity-widget">
          <div className="widget-header">
            <h3 className="widget-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-content">
                <span className="activity-text">New KYC application submitted</span>
                <span className="activity-time">2 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div className="activity-content">
                <span className="activity-text">Application #2847 approved</span>
                <span className="activity-time">5 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🎤</span>
              <div className="activity-content">
                <span className="activity-text">Voice input session completed</span>
                <span className="activity-time">8 minutes ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">⚠️</span>
              <div className="activity-content">
                <span className="activity-text">Document verification required</span>
                <span className="activity-time">12 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPage;