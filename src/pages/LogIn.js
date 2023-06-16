import axios from "axios";
import Popup from "../component/Popup.js";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPopupCreateAcc, setShowPopupCreateAcc] = useState(false);
  const [showPopupSuccessCreateAcc, setShowPopupSuccessCreateAcc] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [usernameAvail, setUsernameAvail] = useState(true);
  const [createClicked, setCreateClicked] = useState(false);
  const [foundUsername, setFoundUsername] = useState(true);
  const [wrongPassword, setWrongPassword] = useState(false);

  // redirects if already logged in
  useEffect(() => {
    document.title = "Login";
    axios.post(`${process.env.REACT_APP_API}/isloggedin`, {}, { withCredentials: true }).then((res) => (res.data ? redirect() : setIsLoading(false)));
    // eslint-disable-next-line
  }, []);

  const redirect = async () => {
    location.state ? navigate(-1) : axios.post(`${process.env.REACT_APP_API}/getusername`, {}, { withCredentials: true }).then((res) => navigate(`/u/${res.data}`));
  };

  const handleLogin = async () => {
    await axios.post(`${process.env.REACT_APP_API}/login`, { username: username, password: password }, { withCredentials: true }).then((res) => {
      if (res.data.code === 200) {
        redirect();
      } else if (res.data.code === 404) {
        setFoundUsername(false);
        setWrongPassword(false);
      } else if (res.data.code === 401) {
        setFoundUsername(true);
        setWrongPassword(true);
      }
    });
  };

  const createAcc = async (e) => {
    // e.preventDefault();
    setCreateClicked(true);
    newUsername.length >= 3 &&
      newPassword.length >= 8 &&
      axios
        .post(`${process.env.REACT_APP_API}/createacc`, { username: newUsername, password: newPassword })
        .then((response) => {
          setNewPassword("");
          setNewUsername("");
          setShowPopupCreateAcc(false);
          setCreateClicked(false);
          setUsernameAvail(true);
          setShowPopupSuccessCreateAcc(true);
        })
        .catch((error) => {
          error.response.status === 409 ? setUsernameAvail(false) : console.log("Error status:", error.response.status);
        });
  };

  const isInputValid = (conditions, trigger) => {
    if (!trigger) {
      return "form-control";
    } else {
      for (let i = 0; i < conditions.length; i++) {
        if (conditions[i] === false) {
          return "form-control border border-danger";
        }
      }
      return "form-control";
    }
  };

  if (isLoading) {
    return <div />;
  }

  return (
    <div className="container my-5 px-4 px-sm-5" style={{ maxWidth: "450px" }}>
      <form className="d-flex flex-column gap-3">
        <div>
          <input type="text" className={isInputValid([foundUsername], true)} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          {!foundUsername && <span style={{ color: "red" }}>Cannot find username.</span>}
        </div>
        <div>
          <input
            type="password"
            className={isInputValid([!wrongPassword], true)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
          />
          {wrongPassword && <span style={{ color: "red" }}>Wrong password.</span>}
        </div>
      </form>
      <div className="d-flex justify-content-between align-items-center">
        <div className="form-check mb-0">
          <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
          <label className="form-check-label" htmlFor="form2Example3">
            Remember me
          </label>
        </div>
      </div>
      <div className="text-center text-lg-start mt-2 pt-2 d-flex flex-column">
        <button type="button" className="btn btn-primary px-4 fw-semibold" onClick={handleLogin}>
          Login
        </button>
        <hr />
        <button className="btn border-0 px-4 py-2 fw-semibold text-white" style={{ background: "#38761d" }} onClick={() => setShowPopupCreateAcc(true)}>
          Create a new account
        </button>
        <p className="small fw-bold mt-2 pt-1 mb-0">
          {"Don't have an account? "}
          <a href="#!" className="link-danger">
            Create an account
          </a>
        </p>
      </div>
      <Popup show={showPopupCreateAcc}>
        <div className="d-flex flex-row justify-content-between align-items-start ps-4 pe-3 pt-3" style={{ width: "100%" }}>
          <div className="fs-4 fw-semibold">Create your account</div>
          <div style={{ width: "100px" }} />
          <button
            className="btn btn-close"
            onClick={() => {
              setShowPopupCreateAcc(false);
              setUsernameAvail(true);
              setCreateClicked(false);
              setNewUsername("");
              setNewPassword("");
            }}
          />
        </div>
        <hr />
        <form className="d-flex flex-column gap-3 px-4 px-sm-5 mt-2">
          <div>
            <input type="text" className={isInputValid([newUsername.length >= 3, usernameAvail], createClicked)} value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Username" />
            {createClicked && usernameAvail && newUsername.length < 3 && <span style={{ color: "red" }}>Username must be at least 3 characters</span>}
            {!usernameAvail && <span style={{ color: "red" }}>Username is already taken</span>}
          </div>
          <div>
            <input
              type="password"
              className={isInputValid([newPassword.length >= 8], createClicked)}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createAcc()}
              placeholder="Password"
            />
            {createClicked && newPassword.length < 8 && <span style={{ color: "red" }}>Password must be at least 8 characters</span>}
          </div>
        </form>
        <div className="d-flex flex-row justify-content-center mt-3 mb-4">
          <button className="btn border-0 text-white px-5 fw-semibold mt-2 mb-2" onClick={createAcc} style={{ background: "#38761d" }}>
            Create account
          </button>
        </div>
      </Popup>
      <Popup show={showPopupSuccessCreateAcc}>
        <div className="d-flex flex-column px-5 py-4 align-items-center gap-4" style={{ maxWidth: "400px" }}>
          <div className="fs-5 text-center fw-semibold">Congratulations, your account has been successfully created.</div>
          <button className="btn text-white fw-semibold my-1 px-4" style={{ background: "#38761d" }} onClick={() => setShowPopupSuccessCreateAcc(false)}>
            Continue
          </button>
        </div>
      </Popup>
    </div>
  );
}

export default LogIn;
