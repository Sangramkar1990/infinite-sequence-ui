import { userService } from "../../services/api";

export default function TechniqueBreakdown() {
   const [breakdown, setBreakdown] = useState({
      
      techniques: {
        Submission: 0,
        Position: 0,
        Sweep: 0,
        Escape: 0,
        Guard: 0,
        Other: 0,

      },
    });
  
    useEffect(() => {
      const fetchStats = async () => {
        try {
          const data = await userService.techniqueBreakdown();
          console.log('breakdown ---- >', {data} )
          setBreakdown(data);
        } catch (error) {
          console.error("Failed to fetch statistics:", error);
        }
      };
  
      fetchStats();
    }, []);
  return (
    <div className="tech-breakdown">
      <h3>Technique Breakdown</h3>
      <ul>
        <li>Submission: 4</li>
        <li>Position: 1</li>
        <li>Sweep: 2</li>
        <li>Escape: 1</li>
      </ul>
    </div>
  );
}
