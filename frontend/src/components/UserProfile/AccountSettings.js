import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/AccountSettings.css";
import "../authentication/css/Form.css";

const AccountSettings = () => {
  const initialFormData = {
    email: localStorage.getItem("email"),
    newEmail: "",
    newPhoneNumber: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState({
    email: localStorage.getItem("email"),
    newEmail: "",
    newPhoneNumber: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    axios
      .get(`http://localhost:3000/user:${email}`, {
        headers: { "x-access-token": token },
      })
      .then((response) => {
        setCurrentUser({
          name: response.data.name,
          surname: response.data.surname,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const config = {
      method: "put",
      url: "http://localhost:3000/user/update",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      data: formData,
    };

    axios(config)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.newEmail) {
            localStorage.removeItem("email");
            localStorage.setItem("email", response.data.newEmail);
          }
          setFormData(initialFormData);
          setShowPopup(true);
          setTimeout(function () {
            setShowPopup(false);
          }, 1500);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="accountSettings">
      <div className="ProfileTitle">Account Settings</div>

      <form className="formContainer" onSubmit={handleSubmit}>
        <div className="form__account">
          <label className="form__input__label" id="n_password">
            New Password:
            <input
              name="newPassword"
              className="form__input"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </label>
          <label className="form__input__label" id="c_password">
            Confirm Password:
            <input
              name="confirmPassword"
              className="form__input"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>

          <button type="submit" id="button_save">
            Save Changes
          </button>

          <label className="form__input__label " id="email">
            Change Email:
            <input
              name="newEmail"
              className="form__input"
              type="email"
              value={formData.newEmail}
              onChange={handleChange}
              placeholder={currentUser.email}
            />
          </label>
          <label className="form__input__label" id="phone">
            New Phone Number:
            <input
              name="newPhoneNumber"
              className="form__input"
              type="tel"
              value={formData.newPhoneNumber}
              onChange={handleChange}
              placeholder={currentUser.phoneNumber}
            />
          </label>
        </div>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <b>User information updated successfully.</b>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
