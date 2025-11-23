import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarNavigation from "../components/dashboard/SidebarNavigation";
import {
  fetchAllSequences,
  fetchMySequences,
  deleteSequence,
} from "../store/sequenceSlice"; // Added fetchMySequences and deleteSequence
import {
  Orbit,
  Target,
  BookOpen,
  Workflow,
  Edit,
  Trash2,
  Play,
} from "lucide-react"; // Added Edit, Trash2, Play
import { useSearchParams, useNavigate } from "react-router-dom"; // Added useNavigate
import { sequenceService } from "../services/api"; // Import sequenceService

export default function Sequences() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const createSequences = searchParams.get("createNew") === "true";
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [showMySequences, setShowMySequences] = useState(false); // New state for toggling my sequences
  const { sequences, loading } = useSelector((state) => state.sequence);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    console.log("sequences ----- >", sequences.data);
  }, [sequences]);

  useEffect(() => {
    if (showMySequences) {
      dispatch(fetchMySequences()); // Dispatch fetchMySequences if showMySequences is true
    } else {
      dispatch(fetchAllSequences()); // Otherwise, dispatch fetchAllSequences
    }
  }, [dispatch, showMySequences]); // Added showMySequences to dependency array

  const handleDeleteSequence = (sequenceId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this sequence? This action cannot be undone."
      )
    ) {
      dispatch(deleteSequence(sequenceId))
        .then(() => {
          // Re-fetch sequences after successful deletion
          if (showMySequences) {
            dispatch(fetchMySequences());
          } else {
            dispatch(fetchAllSequences());
          }
        })
        .catch((error) => {
          console.error("Failed to delete sequence:", error);
          // Optionally, show an error message to the user
        });
    }
  };

  // useEffect(() => {
  //   dispatch(fetchCardsByUser());
  // }, [dispatch]);

  // Memoize filtered data
  // const filtered = useMemo(() => {
  //   if (!cards) return [];
  //   const lower = searchTerm.toLowerCase();
  //   return cards.data.filter((item) => {
  //     return (
  //       item.name.toLowerCase().includes(lower) ||
  //       (item.description && item.description.toLowerCase().includes(lower)) ||
  //       (item.type && item.tags.toLowerCase().includes(lower)) ||
  //       (item.effect && item.effect.toLowerCase().includes(lower))
  //     );
  //   });
  // }, [searchTerm, cards]);
  const types = useMemo(() => {
    const list = sequences.data ?? [];
    const uniqueTypes = [...new Set(list.map((item) => item.type))];
    return ["All", ...uniqueTypes];
  }, [sequences.data]);
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    // fall back to empty array if data is undefined
    const list = sequences.data ?? [];

    return list.filter((item) => {
      // defend against missing strings
      const name = item.name?.toLowerCase() ?? "";
      const desc = item.description?.toLowerCase() ?? "";

      const matchesText = name.includes(term) || desc.includes(term);

      // optional: filter by type and level if you need
      const matchesType = selectedType === "All" || item.type === selectedType;
      const matchesLevel =
        selectedLevel === "All" || item.level === selectedLevel;

      return matchesText && matchesType && matchesLevel;
    });
  }, [searchTerm, selectedType, selectedLevel, sequences.data]);

  return (
    <div className="flex">
      <SidebarNavigation
        selectedItem="sequences"
        triggerCreateSequence={createSequences}
      />

      <div
        className="min-h-screen bg-gray-100 p-6"
        style={{ marginLeft: "306px", width: "calc(100% - 306px)" }}
      >
        <h1 className="text-3xl font-semibold mb-4 text-center">
          BJJ Technique Sequences
        </h1>
        {showMySequences ? (
          <h2 className="text-3xl font-semibold mb-4 text-center">
            Sequences created by you
          </h2>
        ) : (
          <h2 className="text-3xl font-semibold mb-4 text-center">
            All sequences
          </h2>
        )}

        {/* <div className="max-w-md mx-auto mb-6"> */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by title, description or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select> */}
          {showMySequences ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowMySequences(false)}
            >
              Show All Sequences
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowMySequences(true)}
            >
              My Sequences
            </button>
          )}
        </div>

        {loading === "loading" && (
          <p className="text-center text-gray-500">Loading...</p>
        )}
        {loading === "failed" && (
          <p className="text-center text-red-500">Error loading sequences.</p>
        )}
        {loading === "succeeded" && filtered.length === 0 ? (
          <p className="text-center text-gray-500">No sequences found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex">
                    <div className="p-2 bg-amber-100 rounded-lg mr-2 max-h-10">
                      <BookOpen
                        className="w-6 h-6"
                        style={{ color: "orange" }}
                      />
                    </div>
                    <h2 className="text-xl font-medium">{item.name}</h2>
                  </div>
                  {/* Action buttons */}
                  <div className="flex justify-end gap-2 mt-4">
                    {/* Play Button */}
                    <a
                      href={`/flow-viewer?sequenceId=${item.id}`}
                      target="_self"
                      rel="noopener noreferrer"
                      className="relative group"
                    >
                      <button className="flex justify-center items-center bg-blue-100 hover:bg-blue-200 text-blue font-bold p-2 rounded-full w-10 h-10">
                        <Play className="w-5 h-5" />
                      </button>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Play
                      </span>
                    </a>

                    {showMySequences && (
                      <>
                        {/* Edit Button */}
                        <button
                          className="relative group flex justify-center items-center bg-green-100 hover:bg-green-200 text-green font-bold p-2 rounded-full w-10 h-10"
                          onClick={() =>
                            navigate(
                              `/flow-builder?sequenceSelected=${item.id}`
                            )
                          } // Navigate to FlowBuilder for editing
                        >
                          <Edit className="w-5 h-5" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Edit
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          className="relative group flex justify-center items-center bg-red-100 hover:bg-red-200 text-red font-bold p-2 rounded-full w-10 h-10"
                          onClick={() => handleDeleteSequence(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Delete
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="text-gray-600 mb-3 flex-grow">
                    {item.description}
                  </p>
                )}

                <div className="text-sm text-gray-700 mb-3">
                  Techniques: {item.cards ? item.cards.length : 0}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.cards.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                    >
                      <Target className="w-4 h-4 inline-block mr-1" />
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-400">
                  Published: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
