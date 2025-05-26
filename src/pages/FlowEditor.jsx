import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  Handle,
} from "reactflow";
import { useNavigate, useSearchParams } from "react-router-dom"; // Add useSearchParams
import "reactflow/dist/style.css";

// Define card layout sizes
const initialPosition = { x: 50, y: 50 };
const cardWidth = 250;
const cardHeight = 150;
const gapX = 80;
const gapY = 30;
const canvasWidth = 1000;

// Custom Node Component
const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: 15,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        minWidth: 280,
        maxWidth: 300,
      }}
    >
      <Handle type="target" position="left" style={{ background: "#555" }} />
      <div className="card-content">
        <div className="d-flex align-items-center mb-2">
          <label className=" px-2">Name:</label>
          <input
            type="text"
            className="form-control px-2"
            value={data.name}
            disabled
          />
        </div>

        <div className="d-flex align-items-center mb-2">
          <label className=" px-2">Type:</label>
          <input
            type="text"
            className="form-control px-2"
            value={data.type}
            disabled
          />
        </div>
        {/* <div className="mb-2">
          <h5 className="mb">{data.type}</h5>
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="badge bg-secondary text-decoration-none"
            >
              Resource Link
            </a>
          )}
            
        </div> */}
        <div className="d-flex align-items-center mb-2">
          <label className=" px-2">Effect:</label>
          <input
            type="text"
            className="form-control px-2"
            value={data.effect}
            disabled
          />
        </div>
        <div className="d-flex flex-column align-items-center mb-2">
          <label className=" px-2">Description:</label>
          <textarea
            type="text"
            className="form-control px-2"
            rows="3"
            cols="5"
            value={data.description}
            disabled
          />
        </div>
        
      </div>
      <Handle type="source" position="right" style={{ background: "#555" }} />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const FlowEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sequenceSelected = searchParams.get("sequenceSelected");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const calculateNewPosition = (nodeCount) => {
    const cardsPerRow = Math.floor(canvasWidth / (cardWidth + gapX));
    const row = Math.floor(nodeCount / cardsPerRow);
    const col = nodeCount % cardsPerRow;

    return {
      x: initialPosition.x + col * (cardWidth + gapX),
      y: initialPosition.y + row * (cardHeight + gapY),
    };
  };

  const handleAddCard = (card) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: "custom",
      position: calculateNewPosition(nodes.length),
      data: {
        name: card.name,
        type: card.type,
        effect: card.effect,
        description: card.description,
        url: card.url,
      },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setSearchResults([]);
    setSearchQuery("");
  };

  // Remove handleSearch function as we'll search on input change

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await fetch(
        `http://localhost:5001/api/sequences/search/cards?query=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search cards");
      }

      const result = await response.json();
      if (result.success) {
        setSearchResults(result.data);
        setError(null);
      } else {
        throw new Error(result.message || "Failed to search cards");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error searching cards:", error);
    }
  };

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await fetch(
          "http://localhost:5001/api/sequences/user/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sequences");
        }

        const result = await response.json();
        if (result.success) {
          setSequences(result.data);
          setError(null);
        } else {
          throw new Error(result.message || "Failed to fetch sequences");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching sequences:", error);
      }
    };

    fetchSequences();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="d-flex w-100 mb-3 align-items-center justify-content-between">
            {/* Remove the old search form and use the existing input */}
            {/* <input
              type="text"
              className="form-control w-25 me-2"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            /> */}
            {/* Existing select element */}
            <select
              className="form-select w-25 me-2"
              id="sequenceSelect"
              value={sequenceSelected || ""}
            >
              <option value="">Select a sequence</option>
              {sequences.map((sequence) => (
                <option key={sequence.id} value={sequence.id}>
                  {sequence.name}
                </option>
              ))}
            </select>
            <div
              className="d-flex flex-column w-40 position-relative"
              style={{ width: "40%" }}
            >
              <input
                type="text"
                className="form-control w-100 me-2"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchResults.length > 0 && (
                <div
                  className="position-absolute start-0 w-25"
                  style={{ zIndex: 1000, top: "100%" }}
                >
                  <div className="card shadow">
                    <div className="card-body p-0">
                      <h6 className="p-3 mb-0 border-bottom">Search Results</h6>
                      <div
                        className="list-group list-group-flush"
                        style={{ maxHeight: "300px", overflowY: "auto" }}
                      >
                        {searchResults.map((card) => (
                          <button
                            key={card.id}
                            className="list-group-item list-group-item-action border-0"
                            onClick={() => handleAddCard(card)}
                          >
                            <strong>{card.name}</strong>
                            <br />
                            <small className="text-muted">
                              {card.description}
                            </small>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button className="btn btn-secondary me-2">Share</button>
              <button
                className="btn btn-secondary me-2"
                onClick={() => navigate("/create-card")}
              >
                Create Card +
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/create-sequence")}
              >
                Create Sequence +
              </button>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>Flow Editor</h3>
              <p className="text-muted">
                Create and connect cards in this editor
              </p>
            </div>
            <div className="card-body">
              <div style={{ height: "70vh", width: "100%" }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  fitView
                >
                  <MiniMap />
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
            </div>
          </div>

          {/* Display search results */}

          {/* Existing ReactFlow component */}
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;
