import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  Handle,
  MarkerType,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges, // Import applyNodeChanges
} from "reactflow";
import CreateCardModal from "../components/dashboard/CreateCardModal";
import CreateSequenceModal from "../components/dashboard/CreateSequenceModal";
import TechniqueList from "../components/dashboard/TechniqueList";
import { File, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import SidebarNavigation from "../components/dashboard/SidebarNavigation";
import NewCustomNode from "../components/editor/NewCustomNode";
import { useNavigate, useSearchParams } from "react-router-dom"; // Add useSearchParams
import { useDispatch, useSelector } from "react-redux";
import { setSequence } from "../store/sequenceSlice";
import "reactflow/dist/style.css";
import {
  fetchUserSequences,
  fetchSequenceById,
  saveSequence as saveSequenceThunk, // Renamed to avoid conflict with local saveSequence function
  searchCards,
  fetchCardById,
  clearFlowEditorError,
  clearSaveError,
  clearSearchError,
  resetSearchResults,
  deleteSequence,
  deleteCard,
} from "../store/flowEditorSlice";
import { CustomNode } from "../components/editor/CustomNode";
import { CgProfile } from "react-icons/cg";

// Define card layout sizes
const initialPosition = { x: 50, y: 50 };
const cardWidth = 250;
const cardHeight = 150;
const gapX = 80;
const gapY = 30;
const canvasWidth = 1000;

const TestBuilder2 = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSequenceParams = searchParams.get("sequenceSelected");
  const cardId = searchParams.get("cardId");
  const [selectedEdge, setSelectedEdge] = useState(null);
  const user = useSelector((state) => state.user.user);
  const sourceNodeIdRef = useRef(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const [sequenceName, setSequenceName] = useState("LOADING");
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // const [fetchedSequence, setFetchedSequence] = useState(null);

  // useEffect(() => {
  //   console.log("fetchedSequence changed", { fetchedSequence });
  // }, [fetchedSequence]);
  const handleDestroyCard = useCallback((cardId) => {
    console.log("card id", { cardId });

    dispatch(deleteCard(cardId));
  }, []);
  const nodeTypes = useMemo(
    () => ({
      custom: (props) => (
        <CustomNode
          {...props}
          data={{ ...props.data, destroyCard: handleDestroyCard }}
        />
      ),
    }),
    [handleDestroyCard]
  );
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    console.log("inside effect", edge);
    setSelectedEdge(edge);
  }, []);
  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      setHasUnsavedChanges(true);
    },
    [setEdges]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Backspace" && selectedEdge) {
        setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
        setSelectedEdge(null);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        // Make arrow point from target -> source
        setEdges((eds) =>
          eds.map((e) =>
            e.id === selectedEdge.id
              ? {
                  ...e,
                  markerStart: {
                    type: MarkerType.ArrowClosed,
                    width: 40,
                    height: 40,
                  },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 40,
                    height: 40,
                  },
                  bidirection: true,
                }
              : e
          )
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEdge, setEdges]);

  // const hasCardId = cardId ? true : false;
  const dispatch = useDispatch();
  const {
    sequences: flowEditorSequences, // Renamed to avoid conflict with local state
    currentSequence,
    searchResults: flowEditorSearchResults, // Renamed
    status: flowEditorStatus,
    error: flowEditorError,
    saveStatus,
    saveError,
    searchStatus,
    searchError,
    currentCard,
    fetchCardStatus,
    fetchCardError,
  } = useSelector((state) => state.flowEditor);
  const [sequenceSelected, setSequenceSelected] = useState(
    urlSequenceParams || ""
  );
  const previousNodesRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const handleDeleteSequence = async () => {
    if (!sequenceSelected) return;
    dispatch(deleteSequence(sequenceSelected))
      .unwrap()
      .then(() => {
        setSequenceSelected("");
        setNodes([]);
        setEdges([]);
        setSelectedSequenceName("");
        setSequences(sequences.filter((seq) => seq.id !== sequenceSelected));
      })
      .catch((err) => {
        setError(err);
      });
  };

  const calculateNewPosition = (nodeCount) => {
    const cardsPerRow = Math.floor(canvasWidth / (cardWidth + gapX));
    const row = Math.floor(nodeCount / cardsPerRow);
    const col = nodeCount % cardsPerRow;

    return {
      x: initialPosition.x + col * (cardWidth + gapX),
      y: initialPosition.y + row * (cardHeight + gapY),
    };
  };

  // Add new state for tracking changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useEffect(() => {
    console.log("Updated nodes:", nodes);
  }, [nodes]);
  useEffect(() => {
    console.log("unsaved changes state", { hasUnsavedChanges });
  }, [hasUnsavedChanges]);
  // Add onNodesChange handler
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        // Get all the IDs of nodes that are being removed
        const removedNodeIds = changes
          .filter((change) => change.type === "remove")
          .map((change) => change.id);

        // Apply normal node updates first
        let updatedNodes = applyNodeChanges(changes, nds);

        // Nullify `.data.next` for nodes that were pointing to removed nodes
        updatedNodes = updatedNodes.map((node) => {
          if (removedNodeIds.includes(node.data?.next)) {
            return {
              ...node,
              data: {
                ...node.data,
                next: null, // Update the next pointer
              },
            };
          }
          return node;
        });
        // Finally, filter out the nodes that are being removed
        const finalNodes = updatedNodes.filter(
          (node) => !removedNodeIds.includes(node.id)
        );
        previousNodesRef.current = finalNodes;

        // Finally, filter out the nodes that are being removed
        return updatedNodes.filter((node) => !removedNodeIds.includes(node.id));
      });

      // Remove edges connected to removed nodes
      setEdges((eds) => {
        const removedNodeIds = changes
          .filter((change) => change.type === "remove")
          .map((change) => change.id);
        return eds.filter(
          (edge) =>
            !removedNodeIds.includes(edge.source) &&
            !removedNodeIds.includes(edge.target)
        );
      });
      if (!isInitializing) {
        setHasUnsavedChanges(true);
      }

      //   setHasUnsavedChanges(true);
    },
    [setNodes, setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log("drop event", reactFlowInstance);
      if (!reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const cardData = event.dataTransfer.getData("application/reactflow");

      console.log("cardData on drop:", cardData);

      // check if the dropped element is valid
      if (typeof cardData === "undefined" || !cardData) {
        return;
      }

      const card = JSON.parse(cardData);

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `node-${Date.now()}`,
        type: "custom",
        position,
        data: {
          name: card.name,
          type: card.type,
          effect: card.effect,
          description: card.description,
          url: card.url,
          id: card.id,
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setHasUnsavedChanges(true);
    },
    [reactFlowInstance]
  );
  // Helper function to check if nodes have actually changed
  const hasNodesChanged = (previousNodes, currentNodes) => {
    // If this is the first time or no previous nodes, consider it as no change during initialization
    if (!previousNodesRef.current) {
      return false;
    }

    const prevNodes = previousNodesRef.current;

    // Quick check: different lengths
    if (prevNodes.length !== currentNodes.length) {
      return true;
    }

    // Deep comparison of nodes
    for (let i = 0; i < currentNodes.length; i++) {
      const currentNode = currentNodes[i];
      const prevNode = prevNodes.find((n) => n.id === currentNode.id);

      if (!prevNode) {
        return true; // New node added
      }

      // Check if any meaningful properties have changed
      if (
        currentNode.position?.x !== prevNode.position?.x ||
        currentNode.position?.y !== prevNode.position?.y ||
        currentNode.selected !== prevNode.selected ||
        JSON.stringify(currentNode.data) !== JSON.stringify(prevNode.data) ||
        currentNode.type !== prevNode.type ||
        currentNode.hidden !== prevNode.hidden ||
        currentNode.dragging !== prevNode.dragging
      ) {
        return true;
      }
    }

    return false;
  };

  // Function to convert nodes and edges to linked list format
  const convertToLinkedList = () => {
    const nodeMap = new Map();
    console.log("convert linked list nodes", { nodes });
    nodes.forEach((node) => {
      console.log("convert linked list", node);
      return nodeMap.set(node.id, {
        ...node.data,
        position: { x: node.position.x * 1.0, y: node.position.y * 1.0 }, // Include position data
        next: null,
        node_id: node.id,
      });
    });
    // console.log("nodeMap", {nodeMap});

    edges.forEach((edge) => {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      console.log("edge : ", edge);
      // console.log("source node : ", sourceNode);
      // console.log("target node :", targetNode);
      if (sourceNode) {
        sourceNode.next_id = targetNode.id;
        sourceNode.next = edge.target;
        sourceNode.reverse = edge.reverse;
        sourceNode.bidirection = edge.bidirection;
        sourceNode.sourceX = edge.sourceX ? edge.sourceX : false;
        sourceNode.targetY = edge.targetY ? edge.targetY : false;
        sourceNode.targetForX = edge.targetForX ? edge.targetForX : false;
      }
    });

    // Convert to array starting from nodes without incoming edges
    const startNodes = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.node_id)
      // (node) => !edges.some((edge) => edge.target === node.id)
    );

    const linkedList = [];
    const processedNodes = new Set();

    const traverseList = (nodeId) => {
      // console.log("traverseList nodeId", nodeId);
      if (!nodeId || processedNodes.has(nodeId)) return;

      const node = nodeMap.get(nodeId);
      if (node) {
        processedNodes.add(nodeId);
        linkedList.push({
          id: node.id,
          position: node.position,
          next: node.next,
          node_id: node.node_id,
          reverse: node.reverse ? node.reverse : false,
          bidirection: node.bidirection ? node.bidirection : false,
          sourceX: node.sourceX ? node.sourceX : false,
          targetY: node.targetY ? node.targetY : false,
          targetForX: node.targetForX ? node.targetForX : false,
        });
        traverseList(node.next);
      }
    };

    startNodes.forEach((node) => traverseList(node.id));

    return linkedList;
  };

  // Function to save sequence
  const saveSequence = async () => {
    console.log("saving sequence 1");
    if (!sequenceSelected || !hasUnsavedChanges) return;

    const linkedListData = convertToLinkedList();
    if (!linkedListData.length) return;

    dispatch(clearSaveError?.());
    // const linkedListData = convertToLinkedList(); // This logic remains
    console.log("saveSequenceThunk", { linkedListData });
    dispatch(
      saveSequenceThunk({
        sequenceId: sequenceSelected,
        cardsData: linkedListData,
      })
    )
      .unwrap() // Use unwrap to handle promise resolution/rejection here if needed
      .then(() => {
        setHasUnsavedChanges(false);
        // Optionally: dispatch(clearSaveError());
      })
      .catch((err) => {
        // Error is already in saveError from the slice, but you can log or handle locally too
        console.error("Failed to save sequence (local catch):", err);
      });
  };

  // Add auto-save effect
  useEffect(() => {
    console.log("auto save init", { hasUnsavedChanges });
    if (hasUnsavedChanges && sequenceSelected) {
      const timeoutId = setTimeout(() => {
        console.log("saving 0");
        saveSequence();
      }, 2000); // Auto-save after 2 seconds of no changes

      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, hasUnsavedChanges, sequenceSelected]);

  // display selected sequence on page load
  useEffect(() => {
    let is_url_sequence_id = !!urlSequenceParams;
    if (is_url_sequence_id) {
      setIsInitializing(true); // Mark start of loading

      dispatch(fetchSequenceById(urlSequenceParams)).then((data) => {
        if (data.meta.requestStatus === "fulfilled") {
          // Process the loaded sequence data here
          processSequenceData(data);
          console.log("sequence data name ---->", data);
          setSequenceName(data.payload.name);
          setSequenceSelected(urlSequenceParams);
          setIsInitializing(false); // Loading complete, allow changes to mark unsaved
          setHasUnsavedChanges(false); // Reset unsaved changes on fresh load
        }
      });
    }
  }, [urlSequenceParams]);
  useEffect(() => {
    if (cardId) {
      dispatch(fetchCardById(cardId))
        .unwrap()
        .then((cardData) => {
          // console.log("Fetched card:", cardData);

          const cardFromID = {
            name: cardData.card.name,
            description: cardData.card.description,
            url: cardData.card.url,
            type: cardData.card.type,
            effect: cardData.card.effect,
            user: cardData.card.user,
            id: cardData.id,
          };
          // console.log("Fetched card:", cardFromID);
          handleAddCard(cardFromID);
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("cardId");
          navigate(`?${newParams.toString()}`, { replace: true });
        })
        .catch((err) => {
          console.error("Failed to fetch card:", err);
          // Handle error display if needed
        });
      // searchHandler(cardId);
    }
  }, [cardId, dispatch]);

  // useEffect(() => {
  //   const sequenceIdFromUrl = searchParams.get("id");
  //   if (sequenceIdFromUrl) {
  //     dispatch(fetchSequenceById(sequenceIdFromUrl))
  //       .unwrap()
  //       .then((sequenceData) => {
  //         setFetchedSequence(sequenceData)
  //         processSequenceData(sequenceData)
  //       })
  //       .catch((err) => {
  //         console.error("Failed to fetch sequence by id:", err);
  //         setError("Failed to fetch sequence by id.");
  //       });
  //   }
  // }, [searchParams, dispatch]);

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
        id: card.id,
      },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setSearchResults([]);
    setSearchQuery("");
    setHasUnsavedChanges(true);
  };

  // Add edge handling to trigger auto-save
  const onConnect = useCallback((params) => {
    console.log("sourceNodeId from state:", params);
    //  const { target, targetHandle } = params;

     

    setEdges((eds) => {
      if (params.target === sourceNodeIdRef.current) {
        const swappedParams = {
          ...params,
          reverse: true,
          sourceX: params.sourceHandle === "source-right" ? true : false,
          targetY: params.targetHandle === "target-top" ? true : false,
          targetForX: params.sourceHandle === "source-right" ? params.target : false,
          markerStart: { type: MarkerType.ArrowClosed, width: 40, height: 40 },
        };
        return addEdge(swappedParams, eds);
      }

      return addEdge(
        {
          ...params,
           sourceX: params.sourceHandle === "source-right" ? true : false,
          targetY: params.targetHandle === "target-top" ? true : false,
          targetForX: params.sourceHandle === "source-right" ? params.target : false,
          markerEnd: { type: MarkerType.ArrowClosed, width: 40, height: 40 },
        },
        eds
      );
    });

    setHasUnsavedChanges(true);
  }, []);

  // Remove handleSearch function as we'll search on input change
  // function to handle search
  const searchHandler = (query) => {
    if (!query.trim()) {
      dispatch(resetSearchResults()); // Use action to clear results in store
      return;
    }
    dispatch(searchCards(query)).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        setSearchResults(data.payload);
        setError(null);
      }
    });
  };
  const handleSearchChange = async (e) => {
    const query = e.target.value;

    setSearchQuery(query);
    searchHandler(query);

    if (!query.trim()) {
      dispatch(resetSearchResults()); // Use action to clear results in store
      return;
    }
    dispatch(searchCards(query)).then((data) => {
      console.log("search from redux thunk", data);
    });
  };

  useEffect(() => {
    dispatch(fetchUserSequences()).then((data) => {
      // console.log("data----->", data.payload);
      setSequences(data.payload);
      setError(null);
    });
  }, [dispatch]);

  // Function to convert linked list to flow nodes and edges
  const convertLinkedListToFlow = (cards) => {
    if (!cards || !cards.length) return { nodes: [], edges: [] };

    const newNodes = [];
    const newEdges = [];
    // Remove initialPosition calculation here, use stored position

    cards.forEach((card, index) => {
      console.log("each card", card);
      const nodeId = card.node_id ? card.node_id : `node-${index}`;
      // console.log("node 123 id:", nodeId);
      newNodes.push({
        id: nodeId,
        type: "custom",
        position: card.position || calculateNewPosition(index), // Use stored position or calculate if not present
        data: {
          name: card.name,
          type: card.type,
          effect: card.effect,
          description: card.description,
          url: card.url,
          id: card.id,
          position: card.position,
          next: card.next,
          // removeCardFromSequenceHandler: () => removeCardFromSequenceHandler(nodeId),
        },
      });

      if (card.next) {
        const nextCard = cards.find((c) => c.node_id === card.next);
        console.log("card bi", { card: nextCard });
        // console.log("next card", {nextCard});
        const targetNodeId = nextCard ? `${nextCard.node_id}` : null;
        // console.log("target node id", {targetNodeId})

        newEdges.push({
          id: `edge-${nodeId}-node-${targetNodeId}`,
          source: nodeId,
          target: targetNodeId,
          ...(card.bidirection
            ? {
                markerStart: {
                  type: MarkerType.ArrowClosed,
                  width: 40,
                  height: 40,
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 40,
                  height: 40,
                },
              }
            : card.reverse
            ? {
                markerStart: {
                  type: MarkerType.ArrowClosed,
                  width: 40,
                  height: 40,
                },
              }
            : {
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 40,
                  height: 40,
                },
              }),
        });
      }

      // Update position for next node
      // position = calculateNewPosition(index + 1);
    });

    return { nodes: newNodes, edges: newEdges };
  };

  // Modify sequence selection handler
  const [selectedSequenceName, setSelectedSequenceName] = useState("");

  //fetch sequence
  const processSequenceData = (data) => {
    // Extract sequence data
    let sequenceData = data.payload;

    // Convert linked list to flow representation
    const flowData = convertLinkedListToFlow(sequenceData.cards);

    console.log("dispacthing sequence data", { sequenceData });

    // Dispatch the sequence data to Redux store
    dispatch(setSequence([sequenceData]));

    // Logging information
    // console.log(sequenceData);
    // console.log("new nodes", flowData.nodes);
    // console.log("new edges", flowData.edges);

    // Updating state values
    setNodes(flowData.nodes);
    setEdges(flowData.edges);
    setSelectedSequenceName(sequenceData.name);
    setError(null);
  };

  // Modify handleSequenceSelect
  const handleSequenceSelect = async (event) => {
    const selectedId = event.target.value;
    if (!selectedId) {
      setNodes([]);
      setEdges([]);
      setSelectedSequenceName("");
      return;
    }
    setSequenceSelected(selectedId);
    dispatch(fetchSequenceById(selectedId)).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        console.log("fetched sequence data", data);
        processSequenceData(data);
        if (!urlSequenceParams) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("sequenceSelected");
        navigate(`?${newParams.toString()}`, { replace: true });
      }
    });
  };

  // Update the return statement to match FlowViewer's layout
  return (
    <div className="container-fluid ">
      <SidebarNavigation selectedItem="flow-builder" />
      <div
        className="row"
        style={{ marginLeft: "306px", width: "calc(100% - 306px)" }}
      >
        <div className="col-12">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {/* <div className="d-flex mb-3 align-items-center justify-space-between">
            <div>
              {user?.organization_id ? (
                <h2>{"Organization: " + user?.organization_name}</h2>
              ) : (
                <></>
              )}
            </div>
            <div
              className="accountProfile ms-auto"
              style={{ position: "relative" }}
            >
              <button
                className="btn btn-link p-0"
                style={{ fontSize: 28 }}
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label="Profile Menu"
              >
                <CgProfile />
              </button>
              {profileMenuOpen && (
                <div
                  // className="mx-3"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    minWidth: 160,
                    zIndex: 1000,
                  }}
                >
                  <button
                    className="dropdown-item w-100 text-start py-2 ps-4 pe-2 menu-over"
                    onClick={() => navigate("/account")}
                  >
                    <strong>Account</strong>
                  </button>
                  <button
                    className="dropdown-item w-100 text-start py-2 ps-4 pe-2 menu-over"
                    onClick={() => navigate("/organization")}
                  >
                    <strong>Organization</strong>
                  </button>
                  <button
                    className="dropdown-item w-100 text-start py-2 ps-4 pe-2 menu-over"
                    onClick={() => navigate("/teams")}
                  >
                    <strong>Teams</strong>
                  </button>
                  <button
                    className="dropdown-item w-100 text-start py-2 ps-4 pe-2 menu-over"
                    onClick={() => navigate("/roles")}
                  >
                    <strong>Roles</strong>
                  </button>
                </div>
              )}
            </div>
          </div> */}

          {/* <div className="d-flex mb-3 align-items-center justify-content-between">
            <select
              className="form-select w-25 me-2"
              id="sequenceSelect"
              value={sequenceSelected || ""}
              onChange={handleSequenceSelect}
            >
              <option value="">
                {selectedSequenceName || "Select a sequence"}
              </option>
              {sequences?.map((sequence) => (
                <option key={sequence.id} value={sequence.id}>
                  {sequence.name}
                </option>
              ))}
            </select>

            <div
              className="d-flex flex-column w-40 position-relative"
              style={{ width: "30%" }}
            >
              <input
                type="text"
                className="form-control w-100 me-2"
                placeholder="Search"
                value={searchQuery || ""}
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
            </div> */}

          {/* <div>
              <button
                className="btn btn-secondary me-2"
                onClick={() => navigate("/share")}
              >
                Share
              </button>
              <button
                className="btn btn-secondary me-2"
                onClick={() => navigate("/create-card")}
              >
                Create Card +
              </button>
              <button
                className="btn btn-secondary me-2"
                onClick={() => navigate("/create-sequence")}
              >
                Create Sequence +
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteSequence}
                disabled={!sequenceSelected}
              >
                Delete Sequence
              </button>
            </div> */}
        </div>

        <div style={{ zIndex: "1" }}>
          <div className="flex pt-4">
            <h4 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              {sequenceName ? sequenceName : "...LOADING"}
            </h4>
            <div className="ms-auto space-x-2 mb-2">
              <Button
                className="bg-slate-900 hover:bg-slate-800 me-2"
                id="add-technique-button"
              >
                <File className="w-4 h-4 mr-2" />
                Save Sequence
              </Button>
              <Button
                variant="outline"
                className="border-slate-200"
                id="add-sequence-button"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          
          <div className=" flex">
            <div
              ref={reactFlowWrapper}
              onDrop={onDrop}
              onDragOver={onDragOver}
              style={{ height: "90vh", width: "100%" }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onConnect={onConnect}
                onNodesChange={onNodesChange}
                onInit={setReactFlowInstance}
                onNodeClick={() => {
                  setIsInitializing(false);
                }}
                onEdgeClick={onEdgeClick}
                onEdgesChange={onEdgesChange}
                onConnectStart={(event, { nodeId }) => {
                  sourceNodeIdRef.current = nodeId; // Store the source node ID
                }}
                fitView
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#e2e8f0",
                  backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px),
                      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              >
                <MiniMap />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
            <TechniqueList />
          </div>
        </div>
      </div>
      <CreateCardModal
        show={showCardModal}
        onClose={() => setShowCardModal(false)}
      />
      <CreateSequenceModal
        show={showSequenceModal}
        onClose={() => setShowSequenceModal(false)}
      />
    </div>

    // </div>
  );
};

export default TestBuilder2;
