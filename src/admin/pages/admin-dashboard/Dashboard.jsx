import Slidebar from '../../compoents/Sidebar';
import '../../../styles/adminstyles/Dashboard.css'
import AdminDashboard from '../../compoents/Analysis';

function Dashboard() {

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
       <Slidebar />
      </aside>
      <main className="main-content">
         <AdminDashboard />
      </main>
    </div>
  );
}

export default Dashboard;
