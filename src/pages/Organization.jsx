import React, { useState, useEffect } from "react";
import OrganizationSidebar from "../components/OrganizationSidebar";
import Manage from "../components/organizationSidebar/Manage";
import Join from "../components/organizationSidebar/Join";
import Request from "../components/organizationSidebar/Request";
import { useSelector } from "react-redux";


const Organization = () => {
  const [selected, setSelected] = useState("manage");
  const [organizationId, setOrganizationId] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const user = useSelector((state) => state.user.user);
   
  console.log("user :", {user});





  
  useEffect(() => {

     console.log("organization id :", user.organization_public_id)
    setOrganizationId(user.organization_public_id);
    setInviteLink(user.organization_name);
  }, [user.organization_public_id, user.organization_name]);
 

  const renderContent = () => {
    switch (selected) {
      case "manage":
        return  (
          <Manage
           
          /> 
        ) ;
        case "join":
          return (<Join/>)
        case "request" :
          return (<Request/>)

    }
  };



  return (
    <div className="container mt-4 d-flex">
      <OrganizationSidebar
        selected={selected}
        setSelected={setSelected}
      />
      <div className="flex-grow-1 ms-4">{renderContent()}</div>
    </div>
  );
};

export default Organization;
