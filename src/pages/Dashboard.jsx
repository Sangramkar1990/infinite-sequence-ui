
import SidebarNavigation from '../components/dashbord/SidebarNavigation';
import WelcomeBanner from '../components/dashbord/WelcomeBanner';
import StatisticsPanel from '../components/dashbord/StatisticsPanel';
import RecentActivityList from '../components/dashbord/RecentActivityList';
import TechniqueBreakdown from '../components/dashbord/TechniqueBreakdown';
import RecentSequences from '../components/dashbord/RecentSequences';
import QuickActionsPanel from '../components/dashbord/QuickActionsPanel';
const Dashboard = () => {
    return (
    <div className="dashboard-container dashboard_main">
      <SidebarNavigation />
      <main className="main-content dashboard-main px-4">
        <WelcomeBanner />
        <StatisticsPanel />
        <RecentActivityList />
        <TechniqueBreakdown />
        <RecentSequences />
      </main>
      <QuickActionsPanel />
    </div>
  );

}

export default Dashboard;
