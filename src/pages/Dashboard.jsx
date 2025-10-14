import SidebarNavigation from '../components/dashboard/SidebarNavigation';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatisticsPanel from '../components/dashboard/StatisticsPanel';
import RecentActivity from '../components/dashboard/RecentActivityList';
import TechniqueBreakdown from '../components/dashboard/TechniqueBreakdown';
// import RecentActivity from '../components/dashbord/RecentSequences';
// import QuickActionsPanel from '../components/dashbord/QuickActionsPanel';
import QuickActions from '../components/dashboard/QuickActionsPanel';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCardsByUser, fetchAllSequences } from '../store/userSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { cards,sequences, loadedSequences, loadedCards } = useSelector((state) => state.user);
  console.log("Redux state - cards:", cards);
console.log("Redux state - sequences:", sequences);
  const hasLoaded = loadedSequences && loadedCards;

//  useEffect(() => {
//    console.log("useEffect triggered");
//       dispatch(fetchCardsByUser())
//       dispatch(fetchAllSequences())
    
// }, [dispatch]);


useEffect(() => {
   console.log("useEffect triggered");
   dispatch(fetchCardsByUser())
     .then(() => console.log("fetchCardsByUser completed"))
     .catch((error) => console.error("Error in fetchCardsByUser:", error));

   dispatch(fetchAllSequences())
     .then(() => console.log("fetchAllSequences completed"))
     .catch((error) => console.error("Error in fetchAllSequences:", error));
}, [dispatch]);
// Log sequences when they change
  useEffect(() => {
    if (sequences && sequences.length > 0) {
      console.log('Fetched sequences:', sequences);
    }
  }, [sequences]);

  const techniquesByType = {
    submission: 10,
    sweep: 6,
    position: 15,
    escape: 4,
  };
  const techniques = [
  {
    id: 'tech1',
    name: 'Armbar from Guard',
    type: 'submission',
    difficulty_level: 'beginner',
    created_date: '2025-08-27T10:30:00Z',
  },
  {
    id: 'tech2',
    name: 'Scissor Sweep',
    type: 'sweep',
    difficulty_level: 'intermediate',
    created_date: '2025-08-26T14:15:00Z',
  },
];
// const sequences = [
//   {
//     id: 'seq1',
//     name: 'Submission Chain A',
//     techniques: ['armbar', 'triangle'],
//     difficulty_level: 'advanced',
//     created_date: '2025-08-28T08:00:00Z',
//   },
//   {
//     id: 'seq2',
//     name: 'Escape Series',
//     techniques: [],
//     difficulty_level: 'beginner',
//     created_date: '2025-08-25T18:45:00Z',
//   },
// ];
//   const recentSequences = [
//   {
//     id: 'seq1',
//     name: 'Basic Submission Setup',
//     techniques: ['armbar', 'triangle', 'kimura'],
//   },
//   {
//     id: 'seq2',
//     name: 'Guard Sweep Series',
//     techniques: ['scissor_sweep', 'flower_sweep'],
//   },
//   {
//     id: 'seq3',
//     name: 'Escape from Side Control',
//     techniques: ['shrimp_escape', 'bridge_escape', 'underhook_escape', 'roll_escape'],
//   },
//   {
//     id: 'seq4',
//     name: 'Mount Control and Submission',
//     techniques: ['americana', 'cross_choke'],
//   },
//   {
//     id: 'seq5',
//     name: 'Back Control Escapes',
//     techniques: [],
//   },
// ];
// const activities = [
//   { name: 'Kimura', type: 'submission', level: 'beginner', date: 'Jul 10' },
//   { name: 'Berimbolo to Heel Hook', type: 'sequence', level: 'beginner', date: 'Jul 10' },
//   // ...more
// ];


    return (
    <div className=" flex justify-around dashboard_main">
      <SidebarNavigation selectedItem="dashboard"/>
      <main className="main-content flex justify-around dashboard-main px-4 pt-2" style={{marginLeft: "306px", width: "calc(100% - 306px)"}}>
        <WelcomeBanner />
        
        <StatisticsPanel />
        {/* <RecentActivityList /> */}
        {/* <TechniqueBreakdown /> */}
        <div className="flex justify-between ">
          {hasLoaded && (<RecentActivity techniques={cards} sequences={sequences} isLoading={false} />)}
          {hasLoaded && (<QuickActions techniquesByType={techniquesByType} recentSequences={sequences}/>)}

        </div>
        
        {/* <div>
          <h2>Your Cards</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {cards.map((card) => (
                <li key={card.id}>{card.name}</li>
              ))}
            </ul>
          )}
        </div> */}
      </main>
      
    </div>
  );

}

export default Dashboard;
