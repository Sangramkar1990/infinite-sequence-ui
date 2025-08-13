import { BookOpen, Orbit, TrendingUp, Award } from "lucide-react";

export default function StatisticsPanel() {
  return (
    <div className="stats-panel d-flex justify-content-between">

      <div className="bg-white rounded-xl shadow-sm border p-2 flex items-center gap-4" style={{borderRadius: "10px"}}>
      {/* Icon */}
       <h5 className="text-center  text-muted" style={{fontSize: ".8rem", fontWeight: "700"}}>Total Techniques</h5>
      <div className="d-flex px-3 justify-content-between align-items-center">
        <div>
           <p style={{margin:"0", fontSize: "larger", fontWeight: "700"}}>8</p>
        </div>
       

        <div className="p-2" style={{backgroundColor: "#bff3f2", borderRadius: "10px"}}>
        <Orbit className="w-6 h-6" style={{color:"blue"}}/>
        </div>
        
      </div>

      {/* Text */}
      <div className="flex items-center gap-1 text-green-600" style={{color: "green"}}>
  <TrendingUp className="w-4 h-4" />
  <span className="text-xs text-gray-400">+4 since last week</span>
</div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border p-2 flex items-center gap-4" style={{borderRadius: "10px"}}>
      {/* Icon */}
       <h5 className="text-center  text-muted" style={{fontSize: ".8rem", fontWeight: "700"}}>Sequences Created</h5>
      <div className="d-flex px-3 justify-content-between align-items-center">
        <div>
           <p style={{margin:"0", fontSize: "larger", fontWeight: "700"}}>4</p>
        </div>
       

        <div className="p-2" style={{backgroundColor: "rgb(243 220 188)", borderRadius: "10px"}}>
        <BookOpen className="w-6 h-6" style={{color:"orange"}}/>
        </div>
        
      </div>

      {/* Text */}
      <div className="flex items-center gap-1 text-green-600" style={{color: "green"}}>
  <TrendingUp className="w-4 h-4" />
  <span className="text-xs text-gray-400">+1 since last week</span>
</div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border p-2 flex items-center gap-4" style={{borderRadius: "10px"}}>
      {/* Icon */}
       <h5 className="text-center  text-muted" style={{fontSize: ".8rem", fontWeight: "700"}}>Most Used Type</h5>
      <div className="d-flex px-3 justify-content-between align-items-center">
        <div>
           <p style={{margin:"0", fontSize: "larger", fontWeight: "700"}}>Submission</p>
        </div>
       

        <div className="p-2" style={{backgroundColor: "#b6e7c9", borderRadius: "10px"}}>
        <Award className="w-6 h-6" style={{color:"green"}}/>
        </div>
        
      </div>

      {/* Text */}
      
    </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-2 flex items-center gap-4" style={{borderRadius: "10px"}}>
      {/* Icon */}
       <h5 className="text-center  text-muted" style={{fontSize: ".8rem", fontWeight: "700"}}>Avg. Difficulty</h5>
      <div className="d-flex px-3 justify-content-between align-items-center">
        <div>
           <p style={{margin:"0", fontSize: "larger", fontWeight: "700"}}>Intermediate</p>
        </div>
       

        <div className="p-2" style={{backgroundColor: "#e0bcf3", borderRadius: "10px"}}>
        <TrendingUp className="w-6 h-6" style={{color:"purple"}}/>
        </div>
        
      </div>

      {/* Text */}
      
    </div>
      
    </div>
  );
}
