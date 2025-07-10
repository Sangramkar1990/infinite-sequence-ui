import  {
  Handle,
} from "reactflow";

import React, { useState, useRef, useEffect } from "react";
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

    return (
      <div
        style={{
          padding: 30,
          background: selected ? "#f4f4f4" : "#fff",
          border: "1px solid #ccc",
          borderRadius: 8,
          minWidth: 220,
          width: 500,
          position: "relative"
        }}
      >
        <Handle type="target" position="left" style={{ background: "#555", width:10, height:10 }} />
        
        {/* Hamburger Button */}
        <div className="d-flex">

        <div className="w-100">

        
        <button
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            zIndex: 2
          }}
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          &#9776;
        </button>
        {/* Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: 36,
              left: 8,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 3,
              minWidth: 160,
              padding: 8
            }}
          >
            {/* <button
              style={{ width: "100%", padding: 8, marginBottom: 4, cursor: "pointer" }}
              onClick={() => {
                if (data.removeCardFromSequenceHandler) {
                  data.removeCardFromSequenceHandler(data.id);
                }
                setMenuOpen(false);
              }}
            >
              Remove
            </button> */}
            <button
              style={{ width: "100%", padding: 8, color: "#fff", background: "#d32f2f", border: "none", borderRadius: 4, cursor: "pointer" }}
              onClick={() => {
                if (data.destroyCard) {
                  data.destroyCard(data.id);
                }
                setMenuOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        )}
        
        <div className="w-100 d-flex flex-column" style={{marginTop: "235px"}}>
        <label className="form-label ms-auto me-2 mt-2" >Name </label>
        {/* <label className="form-label ms-auto me-2 mt-2">{data.card_data_present}</label> */}
        <label className="form-label ms-auto me-2 " style={{marginTop: "1.8rem"}} >Type </label>
        <label className="form-label ms-auto me-2 " style={{marginTop: "1.8rem"}}>Effect </label>
        <label className="form-label ms-auto me-2 " style={{marginTop: "1.8rem"}}>Description </label>
        </div>
        
        </div>
        <div className="ms-auto">
          <div className="d-flex flex-column">
          { data.url ? <iframe
            width="350"
            height="197"
            src={data.url}
            title="Embedded Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ marginTop: '1rem' }}
            className="ms-auto"
          /> : <div class="alert alert-warning alert-dismissible fade show" role="alert" style={{width: "350px"}}>
          <strong>Warning!</strong>  The card used to create this card in sequence has been deleted , please remove this card and recreate it.
          
        </div>}
          <br/>
          
          <div className="d-flex align-items-center mt-4">
         
          <input
          type="text"
          className="form-control"
          value={data.name}
          disabled={true}
        />
          
          </div>
          <br />
          <div className="d-flex align-items-center mt-4">
          
          <input
          type="text"
          className="form-control"
          value={data.type}
          disabled={true}
        />
          
          </div>
          
          <br />
          <div className="d-flex align-items-center mt-4">
         
          <input
          type="text"
          className="form-control"
          value={data.effect}
          disabled={true}
        />
          
          </div>
          <br />
          <div className="d-flex align-items-center mt-4">
          
          <textarea
          className="form-control"
          
          value={data.description}
          disabled={true}
        /> 
          </div>
          
          <br />
          </div>
        
        </div>
        </div>
        <Handle type="source" position="right" style={{ background: "#555" , width:10, height:10}} />
        
      </div>
    );
  };