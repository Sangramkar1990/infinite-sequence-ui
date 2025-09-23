import { Handle } from "reactflow";
import { Trash2, Target, Play, Tag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";

import React, { useState, useRef, useEffect } from "react";

const typeColors = {
  position: "bg-blue-100 text-blue-800",
  submission: "bg-red-100 text-red-800",
  escape: "bg-green-100 text-green-800",
  sweep: "bg-amber-100 text-amber-800",
  guard: "bg-purple-100 text-purple-800"
};
// edgeStyles.js
export const edgeBaseStyle = {
  stroke: "black",
  strokeWidth: 2.5,
  fill: "none",
  transition: "all 0.2s ease-in-out",
};

export const edgeHoverStyle = {
  stroke: "#f59e0b", // amber-500
};

export const edgeInvisibleHoverArea = {
  stroke: "transparent",
  strokeWidth: 20,
  fill: "none",
  pointerEvents: "stroke",
};

export const deleteButtonStyle =
  "w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg";

export const CustomNode = ({ data, selected = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

    // return (
    //   <div
    //     style={{
    //       padding: 30,
    //       background: selected ? "#f4f4f4" : "#fff",
    //       border: "1px solid #ccc",
    //       borderRadius: 8,
    //       minWidth: 220,
    //       width: 500,
    //       position: "relative"
    //     }}
    //   >
    //     <Handle type="target" position="left" style={{ background: "#555", width:10, height:10 }} />
        
    //     {/* Hamburger Button */}
    //     <div className="d-flex">

    //     <div className="w-100">

        
    //     <button
    //       style={{
    //         position: "absolute",
    //         top: 8,
    //         left: 8,
    //         background: "transparent",
    //         border: "none",
    //         cursor: "pointer",
    //         fontSize: 20,
    //         zIndex: 2
    //       }}
    //       aria-label="Open menu"
    //       onClick={() => setMenuOpen((open) => !open)}
    //     >
    //       &#9776;
    //     </button>
    //     {/* Menu */}
    //     {menuOpen && (
    //       <div
    //         ref={menuRef}
    //         style={{
    //           position: "absolute",
    //           top: 36,
    //           left: 8,
    //           background: "#fff",
    //           border: "1px solid #ccc",
    //           borderRadius: 6,
    //           boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    //           zIndex: 3,
    //           minWidth: 160,
    //           padding: 8
    //         }}
    //       >
    //         {/* <button
    //           style={{ width: "100%", padding: 8, marginBottom: 4, cursor: "pointer" }}
    //           onClick={() => {
    //             if (data.removeCardFromSequenceHandler) {
    //               data.removeCardFromSequenceHandler(data.id);
    //             }
    //             setMenuOpen(false);
    //           }}
    //         >
    //           Remove
    //         </button> */}
    //         <button
    //           style={{ width: "100%", padding: 8, color: "#fff", background: "#d32f2f", border: "none", borderRadius: 4, cursor: "pointer" }}
    //           onClick={() => {
    //             if (data.destroyCard) {
    //               data.destroyCard(data.id);
    //             }
    //             setMenuOpen(false);
    //           }}
    //         >
    //           Delete
    //         </button>
    //       </div>
    //     )}
        
    //     <div className="w-100 d-flex flex-column" style={{marginTop: "235px"}}>
    //     <label className="form-label ms-auto me-2 mt-2" >Name </label>
    //     {/* <label className="form-label ms-auto me-2 mt-2">{data.card_data_present}</label> */}
    //     <label className="form-label ms-auto me-2 " style={{marginTop: "1.8rem"}} >Type </label>
    //     <label className="form-label ms-auto me-2 " style={{marginTop: "1.8rem"}}>Effect </label>
    //     <label className="form-label ms-auto me-2 " style={{marginTop: "1.8rem"}}>Description </label>
    //     </div>
        
    //     </div>
    //     <div className="ms-auto">
    //       <div className="d-flex flex-column">
    //       { data.url ? <iframe
    //         width="350"
    //         height="197"
    //         src={data.url}
    //         title="Embedded Video"
    //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //         allowFullScreen
    //         style={{ marginTop: '1rem' }}
    //         className="ms-auto"
    //       /> : <div class="alert alert-warning alert-dismissible fade show" role="alert" style={{width: "350px"}}>
    //       <strong>Warning!</strong>  The card used to create this card in sequence has been deleted , please remove this card and recreate it.
          
    //     </div>}
    //       <br/>
          
    //       <div className="d-flex align-items-center mt-4">
         
    //       <input
    //       type="text"
    //       className="form-control"
    //       value={data.name}
    //       disabled={true}
    //     />
          
    //       </div>
    //       <br />
    //       <div className="d-flex align-items-center mt-4">
          
    //       <input
    //       type="text"
    //       className="form-control"
    //       value={data.type}
    //       disabled={true}
    //     />
          
    //       </div>
          
    //       <br />
    //       <div className="d-flex align-items-center mt-4">
         
    //       <input
    //       type="text"
    //       className="form-control"
    //       value={data.effect}
    //       disabled={true}
    //     />
          
    //       </div>
    //       <br />
    //       <div className="d-flex align-items-center mt-4">
          
    //       <textarea
    //       className="form-control"
          
    //       value={data.description}
    //       disabled={true}
    //     /> 
    //       </div>
          
    //       <br />
    //       </div>
        
    //     </div>
    //     </div>
    //     <Handle type="source" position="right" style={{ background: "#555" , width:10, height:10}} />
        
    //   </div>
    // );
    return (
      <div
        className="absolute bg-white rounded-xl shadow-lg border border-slate-200 w-72 p-4 cursor-grab active:cursor-grabbing hover:shadow-2xl hover:border-amber-400 transition-all group"
        
        
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-slate-600" />
              </div>
              <h4 className="font-bold text-slate-900 flex-1">
                {data.name}
              </h4>
            </div>
            <div className="flex items-center">
              {data.url && (
                <button
                  
                  className="text-slate-400 hover:text-amber-500 mr-1"
                >
                  <Play className="w-5 h-5" />
                </button>
              )}
              <button
                
                className="text-slate-400 hover:text-red-500 opacity-50 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {data.description ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2 cursor-help">
                  {data.description}
                </p>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="start"
                className="max-w-xs p-2 text-xs bg-slate-800 text-white border-slate-800"
              >
                <p>{data.description}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <p className="text-xs text-slate-500 mb-3">
              No description available.
            </p>
          )}

          <div className="flex-grow" />

          <div className="space-y-2">
            <div className="flex gap-1.5 flex-wrap">
              <Badge variant="secondary" >
                {data.type}
              </Badge>
              <Badge variant="outline">{}</Badge>
            </div>

            {/* {technique.tags && technique.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {technique.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="font-normal text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )} */}
          </div>
        </div>

        {/* Connection Handles */}
        <div className="connection-handle">
          <ConnectionHandle
            position="top"
            // onMouseDown={(e) => handleConnectionStart("top", e)}
          />
        </div>
        <div className="connection-handle">
          <ConnectionHandle
            position="right"
            // onMouseDown={(e) => handleConnectionStart("right", e)}
          />
        </div>
        <div className="connection-handle">
          <ConnectionHandle
            position="bottom"
            // onMouseDown={(e) => handleConnectionStart("bottom", e)}
          />
        </div>
        <div className="connection-handle">
          <ConnectionHandle
            position="left"
            // onMouseDown={(e) => handleConnectionStart("left", e)}
          />
        </div>
      </div>
    );
  };