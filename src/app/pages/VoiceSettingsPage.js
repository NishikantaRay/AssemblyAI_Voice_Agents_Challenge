const VoiceSettingsPage = () => (
  <div className="dashboard-content">
    <div className="page-header">
      <h2 className="page-title">Voice Input Settings</h2>
    </div>
    
    <div className="settings-sections">
      <div className="settings-card">
        <div className="settings-header">
          <h3 className="settings-title">Audio Configuration</h3>
          <p className="settings-description">Configure voice input parameters and quality settings</p>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label className="setting-label">Sample Rate</label>
            <select className="setting-input">
              <option value="16000">16 kHz (Recommended)</option>
              <option value="22050">22.05 kHz</option>
              <option value="44100">44.1 kHz</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Silence Detection Timeout</label>
            <input type="range" className="setting-slider" min="1" max="10" defaultValue="3" />
            <span className="setting-value">3 seconds</span>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Auto-stop after completion</label>
            <div className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="settings-header">
          <h3 className="settings-title">Language & Recognition</h3>
          <p className="settings-description">Configure language settings and recognition preferences</p>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label className="setting-label">Primary Language</label>
            <select className="setting-input">
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Recognition Confidence Threshold</label>
            <input type="range" className="setting-slider" min="0.1" max="1.0" step="0.1" defaultValue="0.7" />
            <span className="setting-value">70%</span>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Enable punctuation</label>
            <div className="setting-toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-card">
        <div className="settings-header">
          <h3 className="settings-title">API Configuration</h3>
          <p className="settings-description">Configure API endpoints and authentication</p>
        </div>
        <div className="settings-content">
          <div className="setting-item">
            <label className="setting-label">AssemblyAI API Key</label>
            <input type="password" className="setting-input" placeholder="Enter your API key" />
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Processing API Endpoint</label>
            <input type="url" className="setting-input" defaultValue={process.env.CLOUDFLARE_API_URL} />
          </div>
          
          <div className="setting-item">
            <label className="setting-label">Enable API monitoring</label>
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

export default VoiceSettingsPage;