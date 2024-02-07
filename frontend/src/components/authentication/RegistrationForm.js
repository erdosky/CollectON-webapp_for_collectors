import { useState, useEffect } from "react";
import axios from "axios";
import "./css/Popup.css";
import "./css/Form.css";

const Registration = () => {
  const initialFormData = {
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    password: "",
  };

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormErrors(validate(formData));
    axios.post("http://localhost:3000/registerForm", formData)
      .then((response) => {
        if (response.status === 200) {
          setFormData(initialFormData);
          setShowPopup(true);
          setTimeout(function () {
            window.location.assign("/login");
          }, 1500)
        }
      }).catch((error) => {
        console.error(error);
        setShowPopup2(true);
        setTimeout(function () {
          window.location.assign("/register");
        }, 2500)
      });;
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formData);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const nameRegex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-zA-ZĄĆĘŁŃÓŚŹŻ]+$/;
    const surnameRegex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-zA-ZĄĆĘŁŃÓŚŹŻ-]*$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-ZĄĆĘŁŃÓŚŹŻ]{2,4}$/;
    const passwordRegex =
      /^(?=.*[a-ząćęłńóśźż])(?=.*[A-ZĄĆĘŁŃÓŚŹŻ])(?=.*\d)[a-zA-Ząćęłńóśźż\d]{5,}$/;
    const phoneNumberRegex = /^\d{9}$/;

    if (!values.name) {
      errors.name = "Name is required.";
    }
    else if (!nameRegex.test(values.name)) {
      errors.name = "Invalid name format.";
    }
    if (!values.surname) {
      errors.surname = "Surname is required.";
    }
    else if (!surnameRegex.test(values.surname)) {
      errors.surname = "Invalid surname format.";
    }
    if (!values.email) {
      errors.email = "Email is required.";
    }
    else if (!emailRegex.test(values.email)) {
      errors.email = "Invalid email format.";
    }
    if (!values.password) {
      errors.password = "Password is required.";
    }
    else if (!passwordRegex.test(values.password)) {
      errors.password = "Invalid password format.";
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    }
    else if (!phoneNumberRegex.test(values.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format.";
    }
    return errors;
  };

  return (
    <>
      <form className="formContainer" onSubmit={handleSubmit}>
        <div className="shapeRegister">
          <div className="FormTitle">Register</div>
          <link
            href="https://fonts.googleapis.com/css?family=Roboto"
            rel="stylesheet"
          />
          <div className="form__group">
            <input type="text" className="form__input" name="name" placeholder="Name" onChange={handleChange} value={formData.name} />
            <div className="form__error">{formErrors.name}</div>
            <input
              type="text"
              className="form__input"
              name="surname"
              placeholder="Surname"
              onChange={handleChange}
              value={formData.surname}
            />
            <div className="form__error">{formErrors.surname}</div>
            <input
              type="email"
              className="form__input"
              name="email"
              placeholder="E-mail"
              onChange={handleChange}
              value={formData.email}
            />
            <div className="form__error">{formErrors.email}</div>
            <input
              type="tel"
              className="form__input"
              name="phoneNumber"
              placeholder="Phone number"
              onChange={handleChange}
              value={formData.phoneNumber}
            />
            <div className="form__error">{formErrors.phoneNumber}</div>
            <input
              type="password"
              className="form__input"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
            />
            <div className="form__error">{formErrors.password}</div>
            <div class="container">
              <div className="formMessage">
                <a href="/login">Already have an account? Login</a>
              </div>
              <div>
                <button class="but">Sign up</button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <b> User successfully registered. </b>
            <br></br>
            <b>Redirecting to login page. </b>
          </div>
        </div>
      )}

      {showPopup2 && (
        <div className="popup">
          <div className="popup-content">
            <b> Registration falied. </b>
            <br></br>
            <b>Something went wrong. </b>
          </div>
        </div>
      )}

    </>
  );
};

export default Registration;
