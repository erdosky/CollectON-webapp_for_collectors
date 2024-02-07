import React from "react";
import { useParams } from "react-router-dom";
import "./css/UserProfile.css";

import UserSidebar from "./UserSidebar";
import NavbarForLoggedUser from "../navbars/NavbarForLoggedUser";
import Footer from "../Footer";
import Profile from "./Profile";
import MyCollections from "./MyCollections";
import AccountSettings from "./AccountSettings";
import Offers from "../offers/Offers";

const UserProfile = () => {
  const { activepage } = useParams();
  return (
    <>
      <div className="userprofile">
        <NavbarForLoggedUser />
        <div className="userprofilein">
          <div className="userprofileleft">
            {<UserSidebar activepage={activepage} />}
          </div>

          {
            <div className="userprofileright">
              {activepage === "accountsettings" && <AccountSettings />}
              {activepage === "profile" && <Profile />}
              {activepage === "mycollections" && <MyCollections />}
              {activepage === "offers" && <Offers />}
            </div>
          }
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserProfile;
