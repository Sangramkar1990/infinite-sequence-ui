import React, { useEffect, useState } from "react";
import {
  Target,
  BookOpen,
  Workflow,
  Plus,
  Play,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "../ui/button";
import CreateCardModal from "./CreateCardModal";
import CreateSequenceModal from "./CreateSequenceModal";
import { useSelector } from "react-redux";
import { has } from "lodash";

export default function WelcomeBanner() {
  const [showCardModal, setShowCardModal] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [permissions, setPermissions] = useState([]);
  
  // const { permissions } = user;
  useEffect(() => {
    if (user && user.permissions) {
      setPermissions(user.permissions);
      console.log("User permissions:", {
        hasManageTechniquesPermission:
          permissions.includes("manage_techniques"),
        permissions,
        hasManageSequencePermission: permissions.includes("manage_sequence"),
      });
    }
  }, [user]);
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
          Welcome back to BJJ Flow
        </h1>
        <p className="text-slate-600 text-lg">
          Build, visualize, and master your jiu jitsu sequences
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          className="bg-slate-900 hover:bg-slate-800"
          id="add-technique-button"
          
          disabled={false}
          // onClick={() => {
          //   permissions.includes("manage_techniques") && setShowCardModal(true);
          // }}
          onClick={() => {
            console.log("Add Technique Button Clicked", {permissions:permissions});
            if (permissions.includes("manage_techniques")) {
              console.log('User has manage_techniques permission');
              setShowCardModal(true);
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Technique
        </Button>

        <Button
          variant="outline"
          className="border-slate-200"
          id="add-sequence-button"
          disabled={false}
          // onClick={() => {permissions.includes("manage_sequence") && setShowSequenceModal(true)}}
          onClick={() => {
            if (permissions.includes("manage_sequence")) {
              setShowSequenceModal(true);
            }
          }}
        >
          <Workflow className="w-4 h-4 mr-2" />
          New Sequence
        </Button>
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
  );
}
