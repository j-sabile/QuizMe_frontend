import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spinner, Popover, OverlayTrigger } from "react-bootstrap";

function NavBar() {
  const navigate = useNavigate();

  // loading
  const [isLoading, setIsLoading] = useState(true);

  // navbar
  const [displayUsername, setDisplayUsername] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [foundUsername, setFoundUsername] = useState(true);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCreatingAcc, setIsCreatingAcc] = useState(false);
  // create account
  const [inCreateAccount, setInCreateAccount] = useState(false);
  const [createClicked, setCreateClicked] = useState(false);
  const [usernameAvail, setUsernameAvail] = useState(true);
  const [showSuccessCreateAcc, setShowSuccessCreateAcc] = useState(false);

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API}/getusername`, {}, { withCredentials: true }).then((res) => {
      if (res.data) setDisplayUsername(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleLogIn = async () => {
    setIsLoggingIn(true);
    await axios.post(`${process.env.REACT_APP_API}/login`, { username: username, password: password }, { withCredentials: true }).then((res) => {
      if (res.data.code === 200) {
        window.location.reload();
      } else if (res.data.code === 401) {
        setFoundUsername(true);
        setWrongPassword(true);
      } else if (res.data.code === 404) {
        setFoundUsername(false);
        setWrongPassword(false);
      }
    });
    setIsLoggingIn(false);
  };

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    await axios.post(`${process.env.REACT_APP_API}/logout`, {}, { withCredentials: true }).then((res) => {
      navigate("/");
      console.log(res.data);
    });
    setIsLoggingOut(false);
    window.location.reload();
  };

  const handleCreateAccount = async () => {
    setIsCreatingAcc(true);
    setCreateClicked(true);
    username.length >= 3 &&
      password.length >= 8 &&
      axios.post(`${process.env.REACT_APP_API}/createacc`, { username: username, password: password }).then((res) => {
        if (res.data.code === 201) {
          setShowLogIn(false);
          setShowSuccessCreateAcc(true);
        } else if (res.data.code === 409) {
          setUsernameAvail(false);
        }
      });
    setIsCreatingAcc(false);
  };

  const handleGoToCreateNewAcc = () => {
    reset();
    setInCreateAccount(true);
  };

  const reset = () => {
    setUsername("");
    setPassword("");
    setShowSuccessCreateAcc(false);
    setInCreateAccount(false);
    setCreateClicked(false);
    setFoundUsername(true);
    setWrongPassword(false);
  };

  const isInputValid = (conditions, trigger) => {
    return trigger === false || conditions.every(Boolean) ? "form-control" : "form-control border border-danger";
  };

  useEffect(() => {
    let delayTimeout;

    const fetchSearchResults = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API}/search`, { searchRequest: search });
        setSearchResults(response.data.req);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (search) {
      delayTimeout = setTimeout(() => {
        fetchSearchResults();
      }, 750); // Delay of 500 milliseconds before making the request
    } else setSearchResults([]);

    return () => clearTimeout(delayTimeout); // Clean up the timeout on component unmount
  }, [search]);

  useEffect(() => console.log(searchResults), [searchResults]);

  const popover = (
    <Popover id="popover-basic" className="w-100" style={{ minHeight: "3rem" }}>
      <Popover.Body className="p-2">
        <ul className="list-group list-group-flush">
          {searchResults.map((item, index) => (
            <li className="list-group-item" key={index}>
              <Link to={`/u/${item.username}`} style={{ textDecoration: "none", color: "#000000" }}>
                {item.username}
              </Link>
            </li>
          ))}
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="sticky-top bg-primary py-2">
      <div className="container d-flex flex-row justify-content-between align-items-center">
        {/* title */}
        <div className="fs-3 text-white fw-semibold clickable" onClick={() => navigate("/")}>
          QuizMe
        </div>

        <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose={true}>
          <div className="input-group mx-3 w-100" style={{ maxWidth: "350px" }}>
            <input type="text" className="form-control border border-0 text-white" value={search} onChange={(e) => setSearch(e.target.value)} aria-describedby="search" style={{ backgroundColor: "#1084FC" }} />
            <button className="btn border border-0" type="button" id="btn-search" style={{ backgroundColor: "#1084FC" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </div>
        </OverlayTrigger>

        {!isLoading && (
          //
          <div className="d-flex align-items-center gap-2 position-relative justify-content-end">
            {displayUsername ? (
              <>
                {/* Logged In */}
                <div className="fs-5 text-white">{displayUsername}</div>
                <div className="clickable" onClick={() => setShowMenu(!showMenu)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  </svg>
                </div>
                {/* Show Menu */}
                {showMenu && (
                  <div className="position-absolute bg-white px-2 py-1 border border-2 rounded-3 d-flex flex-column" style={{ top: "60px", width: "170px" }}>
                    <button
                      className="btn fw-semibold"
                      onClick={() => {
                        navigate(`/u/${displayUsername}`);
                        window.location.reload();
                      }}>
                      Account
                    </button>
                    <hr className="m-0" />
                    <button className="btn fw-semibold" onClick={handleLogOut} disabled={isLoggingOut}>
                      {isLoggingOut ? (
                        <>
                          <Spinner size="sm" />
                          Logging Out...
                        </>
                      ) : (
                        "Log Out"
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Popup below navbar
              <>
                {/* Logged Out */}
                <button className="btn btn-primary px-2 px-sm-4 fw-semibold border border-white border-2" onClick={() => setShowLogIn(!showLogIn)}>
                  Login
                </button>
                {/* Show Log In*/}
                {showLogIn && (
                  <div className="position-absolute bg-white p-3 border border-2 rounded-3" style={{ top: "65px", width: "300px" }}>
                    <form className="d-flex flex-column gap-3">
                      <div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={inCreateAccount ? isInputValid([username.length >= 3, usernameAvail], createClicked) : isInputValid([foundUsername], true)}
                          placeholder="Username"
                        />
                        {!foundUsername && <span style={{ color: "red" }}>Cannot find username.</span>}
                        {createClicked && usernameAvail && username.length < 3 && <span style={{ color: "red" }}>Username must be at least 3 characters</span>}
                        {!usernameAvail && <span style={{ color: "red" }}>Username is already taken</span>}
                      </div>
                      <div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (inCreateAccount ? handleCreateAccount() : handleLogIn())}
                          className={inCreateAccount ? isInputValid([password.length >= 8], createClicked) : isInputValid([!wrongPassword], true)}
                          placeholder="Password"
                        />
                        {wrongPassword && <span style={{ color: "red" }}>Wrong password.</span>}
                        {createClicked && password.length < 8 && <span style={{ color: "red" }}>Password must be at least 8 characters</span>}
                      </div>
                    </form>
                    <div className="text-center text-lg-start mt-2 pt-2 d-flex flex-column">
                      {inCreateAccount ? (
                        <>
                          <button className="btn border-0 px-4 py-2 fw-semibold text-white" style={{ background: "#38761d" }} onClick={handleCreateAccount} disabled={isCreatingAcc}>
                            {isCreatingAcc ? (
                              <>
                                <Spinner size="sm" />
                                Creating account...
                              </>
                            ) : (
                              "Create account"
                            )}
                          </button>
                          <hr />
                          <button className="btn fw-semibold" onClick={reset}>
                            Go back to Log In
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="btn btn-primary px-4 fw-semibold" onClick={handleLogIn} disabled={isLoggingIn}>
                            {isLoggingIn ? (
                              <>
                                <Spinner size="sm" />
                                Logging In...
                              </>
                            ) : (
                              "Log In"
                            )}
                          </button>
                          <hr />
                          <button className="btn border-0 px-4 py-2 fw-semibold text-white" style={{ background: "#38761d" }} onClick={handleGoToCreateNewAcc}>
                            Create a new account
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {showSuccessCreateAcc && (
                  <div className="position-absolute bg-white p-3 border border-2 rounded-3 d-flex flex-column gap-2 align-items-center" style={{ top: "65px", width: "300px" }}>
                    <div className="fs-5 text-center fw-semibold">Congratulations, your account has been successfully created.</div>
                    <button className="btn text-white fw-semibold my-1 px-4" style={{ background: "#38761d" }} onClick={reset}>
                      Continue
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
