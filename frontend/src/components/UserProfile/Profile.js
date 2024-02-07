import React, { useState, useEffect } from "react";
import "./css/Profile.css";
import "../authentication/css/Form.css";
import axios from "axios";

const Profile = () => {
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("email");

      try {
        const response = await axios.get(`http://localhost:3000/user:${userEmail}`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        const userData = response.data;
        setNewName(userData.name || "");
        setNewSurname(userData.surname || "");
        setCountry(userData.country || "");
        setBio(userData.bio || "");
        setImage(userData.profileImage || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = {
      newName: newName,
      newSurname: newSurname,
      country: country,
      bio: bio,
      profileImage: image,
      userEmail: localStorage.getItem("email"),
    };

    const config = {
      method: "put",
      url: "http://localhost:3000/user/profile/update",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      data: formData,
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 1500);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.error("Error: ", error);
    };
  };

  return (
    <div className="Profile">
      <div className="ProfileTitle">Profile</div>
      <form className="formContainer" onSubmit={handleSubmit}>
        <div className="form__profile">
          <div
            className="avatar-preview"
            style={{ backgroundImage: `url(${image})` }}
            onClick={() => document.getElementById("avatarInput").click()}
          >
            {!image && <div className="avatar-placeholder">Avatar</div>}
            <i className="fa fa-upload avatar-upload-icon"></i>
          </div>

          <div id="dodawanie>">
            <input
              id="avatarInput"
              type="file"
              onChange={convertToBase64}
              accept="image/jpeg, image/png"
              style={{ display: "none" }}
            />
          </div>

          <label className="form__input__label" id="bio">
            Bio:
            <textarea
              className="bio__input"
              type="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>

          <button type="submit" id="button_save1">
            Save Changes
          </button>

          <label className="form__input__label" id="name">
            Name:
            <input
              className="form__input"
              type="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </label>

          <label className="form__input__label" id="surname">
            Surname:
            <input
              className="form__input"
              type="surname"
              value={newSurname}
              onChange={(e) => setNewSurname(e.target.value)}
            />
          </label>

          <label className="form__input__label" id="country">
            Country:
            <input
              className="form__input"
              type="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
        </div>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <b>User details updated successfully.</b>
            <br></br>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
