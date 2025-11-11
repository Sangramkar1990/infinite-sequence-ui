import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeamsByOrganization } from "../store/teamSlice";
import { createShare, updateShare, fetchShareBySequenceId, clearShare, clearSuccess } from "../store/shareSlice"; // Import share actions
import SidebarNavigation from '../components/dashboard/SidebarNavigation'; // Import SidebarNavigation
import { useNavigate, useSearchParams } from 'react-router-dom'; // Import useNavigate and useSearchParams
// import './ShareSequenceForm.css'; // Optional: for styling

// const teams = ["Error Loading Teams"];

const ShareSequenceForm = () => {
  const [sequenceName, setSequenceName] = useState("");
  const [entireOrg, setEntireOrg] = useState(true);
  const [teamIds, setTeamIds] = useState([]);
  const user = useSelector((state) => state.user.user);
  const organizationId = user?.membership[0].organization_id; // Corrected access to organization_id
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [shareName, setShareName] = useState(""); // Initialize shareName state

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchParams] = useSearchParams(); // Initialize useSearchParams
  
  useEffect(()=>{
    console.log("organizationId :", organizationId, user); // For debugging
  }, [organizationId, user]);

  // Extract sequenceId and sequenceName from URL search parameters
  const sequenceId = searchParams.get('sequenceId');
  const currentSequenceName = searchParams.get('sequenceName') || "Unnamed Sequence"; // Default name
  // Removed isEditing from search params

  const { teams, loading, error } = useSelector((state) => {
     console.log("Share.jsx - useSelector state.team:", state.team);
    console.log("Share.jsx - useSelector state.team.teams:", state.team.teams);
    return state.team});

  const { currentShare, loading: shareLoading, error: shareError, success: shareSuccess } = useSelector((state) => state.share); // Get share state

  useEffect(() => {
    // Initialize sequenceName from URL or currentShare if available
    // console.log("current share", currentShare)
    if (currentShare && currentShare.name) {
      setShareName(currentShare.share.name);
    } 
  }, [currentSequenceName, currentShare]);

   useEffect(() => {
    console.log("Share.jsx - User:", user);
    console.log("Share.jsx - Organization ID:", organizationId);
    if (organizationId) {
      console.log("Share.jsx - Dispatching fetchTeamsByOrganization with ID:", organizationId);
      dispatch(fetchTeamsByOrganization(organizationId));
    } else {
      console.log("Share.jsx - organizationId is not available, not dispatching fetchTeamsByOrganization.");
    }
  }, [dispatch, organizationId, user]); // Added user to dependency array to re-run if user object changes

  useEffect(() => {
    if (sequenceId) { // Always attempt to fetch if sequenceId is present
      dispatch(fetchShareBySequenceId(sequenceId));
    }
    return () => {
      dispatch(clearShare()); // Clear share state on unmount
    };
  }, [dispatch, sequenceId]);

  useEffect(() => {
    if (currentShare) {
      setShareName(currentShare.share.name); // Set shareName from currentShare
      setEntireOrg(currentShare.share.entire_org);
      setTeamIds(currentShare.share.team_ids || []);
      setSelectedTeams(currentShare.share.team_ids || []);
    } else {
      // If no currentShare, reset to default values for a new share
      setEntireOrg(true);
      setTeamIds([]);
      setSelectedTeams([]);
    }
  }, [currentShare]);

  useEffect(() => {
    console.log("Share.jsx - Teams state:", teams);
    console.log("Share.jsx - Loading state:", loading);
    console.log("Share.jsx - Error state:", error);
    console.log("Share.jsx - entireOrg state:", entireOrg);
  }, [teams, loading, error, entireOrg]);

  useEffect(() => {
    if (shareSuccess) {
      alert("Share operation successful!");
      dispatch(clearSuccess()); // Clear success state
      navigate(`/flow-builder?sequenceId=${sequenceId}`); // Navigate back after success
    }
    if (shareError) {
      alert(`Share operation failed: ${shareError}`);
    }
  }, [shareSuccess, shareError, dispatch, navigate, sequenceId]);


  const handleToggle = () => {
    setEntireOrg((prevEntireOrg) => {
      const newEntireOrg = !prevEntireOrg;
      console.log("Share.jsx - entireOrg toggled to:", newEntireOrg);
      // Clear selected teams and team IDs whenever the sharing mode changes
      setSelectedTeams([]);
      setTeamIds([]);
      return newEntireOrg;
    });
  };

  const handleTeamSelect = (teamId) => {
    setTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSave = () => {
    const payload = {
      sequence_id: sequenceId, // Now from searchParams
      name: shareName,
      entire_org: entireOrg,
      organization_id: organizationId,
      team_ids: entireOrg ? [] : teamIds,
    };

    if (currentShare && currentShare.id) { // Check if currentShare exists to determine update or create
      dispatch(updateShare({ share_id: currentShare.id, data: payload })); // Use currentShare.id for update
    } else {
      dispatch(createShare(payload));
    }
    console.log("Share payload:", payload); // For debugging
    // After saving, navigate back to the sequence editor or a confirmation page
    // Navigation will now happen in the useEffect after shareSuccess
  };

  return (
    <div className="flex">
      <SidebarNavigation selectedItem="flow-builder" /> {/* Add SidebarNavigation */}
      <div className="min-h-screen bg-gray-50 p-6" style={{ marginLeft: "306px", width: "calc(100% - 306px)" }}>
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate(`/flow-builder?sequenceId=${sequenceId}`)}
          >
            Go back to sequence 
          </span>{' '}
          &lt; Share the sequence
        </div>

        <h1 className="text-3xl font-semibold text-center mb-6">
          Share Sequence
        </h1>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
          {/* Form content goes here, styled similarly to TechniquesNew.jsx */}
          <div className="flex-1">
            <div className="form-group mb-4">
              <label htmlFor="shareName" className="block text-gray-700 text-sm font-bold mb-2">
                Share Name
              </label>
              <input
                type="text"
                id="shareName"
                value={shareName}
                onChange={(e) => setShareName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="form-group mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input
                  type="checkbox"
                  checked={entireOrg}
                  onChange={handleToggle}
                  className="mr-2 leading-tight"
                />
                Share with entire Organization
              </label>
            </div>

            <div className="form-group mt-5">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Share with Specific Teams
              </label>
              <div className="team-options grid grid-cols-1 md:grid-cols-2 gap-2">
                {loading || shareLoading && <p>Loading teams...</p>}
                {error && <p className="text-red-500">Error: {error.message}</p>}
                {!loading && teams && teams.length > 0 ? (
                  teams.map((team) => (
                    <label key={team.id} className="team-option flex items-center">
                      <input
                        type="checkbox"
                        disabled={entireOrg}
                        checked={selectedTeams.includes(team.id)} // Corrected checked prop
                        onChange={() => handleTeamSelect(team.id)}
                        className="mr-2 leading-tight"
                      />
                      <span className="text-gray-700">{team.name}</span>
                    </label>
                  ))
                ) : (
                  !loading && !error && <p className="text-gray-500">No teams available.</p>
                )}
              </div>
            </div>

            <div className="button-group flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => navigate(`/flow-builder?sequenceId=${sequenceId}`)} // Navigate back on Cancel
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSequenceForm;