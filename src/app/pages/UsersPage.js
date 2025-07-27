

import dummyUsers from '../data/dummyUsers';

const UsersPage = () => (
  <div className="dashboard-content">
    <div className="page-header">
      <h2 className="page-title">User Management</h2>
      <div className="page-actions">
        <button className="btn-primary">Add New User</button>
      </div>
    </div>

    <div className="users-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      {dummyUsers.map((user, idx) => (
        <div className="user-card" key={idx} style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="user-avatar" style={{ background: '#ececec', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 22, marginBottom: 12 }}>{user.initials}</div>
          <div className="user-info" style={{ textAlign: 'center' }}>
            <h3 className="user-name" style={{ margin: 0 }}>{user.name}</h3>
            <p className="user-email" style={{ margin: '4px 0 8px 0', color: '#888', fontSize: 14 }}>{user.email}</p>
            <span className={`user-role ${user.roleClass}`}>{user.role}</span>
          </div>
          <div className="user-actions" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn-secondary">Edit</button>
            <button className="btn-outline">Delete</button>
          </div>
        </div>
      ))}
    </div>

    <div className="users-table">
      <h3 className="section-title">All Users</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.roleClass}`}>{user.role}</span>
                </td>
                <td>{idx === 0 ? '2 hours ago' : idx === 1 ? '5 minutes ago' : 'N/A'}</td>
                <td>
                  <span className="status-badge active">Active</span>
                </td>
                <td>
                  <button className="btn-sm">Edit</button>
                  <button className="btn-sm danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default UsersPage;
