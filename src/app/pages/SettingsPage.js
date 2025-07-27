const SettingsPage = () => (
  <div className="dashboard-content">
    <div className="page-header">
      <h2 className="page-title">System Settings</h2>
    </div>
    
    <div className="settings-sections">
      <div className="settings-card">
        <div className="settings-header">
          <h3 className="settings-title">General Settings</h3>
          <p className="settings-description">Configure general application settings</p>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label className="setting-label">Application Name</label>
            <input type="text" className="setting-input" defaultValue="KYC Admin Panel" />
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Time Zone</label>
            <select className="setting-input">
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Date Format</label>
            <select className="setting-input">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="settings-header">
          <h3 className="settings-title">Security Settings</h3>
          <p className="settings-description">Configure security and authentication settings</p>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label className="setting-label">Session Timeout</label>
            <select className="setting-input">
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Require Two-Factor Authentication</label>
            <div className="setting-toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </div>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Password Minimum Length</label>
            <input type="number" className="setting-input" min="6" max="20" defaultValue="8" />
          </div>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="settings-header">
          <h3 className="settings-title">Notification Settings</h3>
          <p className="settings-description">Configure notification preferences</p>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label className="setting-label">Email Notifications</label>
            <div className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </div>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Application Approval Notifications</label>
            <div className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </div>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">System Maintenance Alerts</label>
            <div className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="btn-outline">Reset to Defaults</button>
        <button className="btn-primary">Save Settings</button>
      </div>
    </div>
  </div>
);

export default SettingsPage;