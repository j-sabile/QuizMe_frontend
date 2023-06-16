import React, { useEffect, useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => (document.title = "Quiz Me"), []);

  const handleRegister = async () => {
    await axios.post(`${process.env.REACT_APP_API}/createacc`, { username: username, password: password }).then((res) => {
      setUsername("");
      setPassword("");
    });
  };

  return (
    <div className="container my-5 px-4 px-sm-5" style={{ maxWidth: "450px" }}>
      <form className="d-flex flex-column gap-3">
        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="button" className="btn btn-primary px-4 mt-3" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
