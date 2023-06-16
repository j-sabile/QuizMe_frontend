import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./MyNavBar";
import dayjs from "dayjs";

function UserProfile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [userData, setUserData] = useState();
  const [selected, setSelected] = useState("created");
  const [status, setStatus] = useState();

  useEffect(() => {
    const handleAcceptRequest = async () => {
      await axios.post(`${process.env.REACT_APP_API}/acceptfriendrequest`, { username: username }, { withCredentials: true }).then((res) => {
        if (res.data.code === 200) setStatus(friends);
      });
    };
    const friends = (
      <button className="btn btn-primary px-3 rounded-3" disabled>
        Friends
      </button>
    );
    const editProfile = (
      <button className="btn btn-primary px-3 rounded-3" disabled>
        Edit Profile
      </button>
    );
    const acceptRequest = (
      <button className="btn btn-primary px-3 rounded-3" onClick={handleAcceptRequest}>
        Accept Friend Request
      </button>
    );
    const e = async () => {
      console.log(username);
      axios.post(`${process.env.REACT_APP_API}/getprofileinfo`, { username: username.toString() }, { withCredentials: true }).then((res) => {
        setUserData(res.data.profileInfo);
        if (res.data.message === "Success (Own Account)") setStatus(editProfile);
        else if (res.data.message === "Success (Friend's Account)") setStatus(friends);
        else if (res.data.message === "Success (Sent Friend Request)") setStatus(cancelRequest);
        else if (res.data.message === "Success (Received Friend Request)") setStatus(acceptRequest);
        else if (res.data.message === "Success (Not Friend)") setStatus(addFriend);
        else if (res.data.message === "Success (Not Logged In)") setStatus(<button className="btn btn-primary px-3 rounded-3">Add Friend</button>);

        document.title = `${res.data.profileInfo.userInfo.username} - Quiz Me`;
      });
    };
    e();
  }, [username]);

  const handleAddFriend = async () => {
    await axios.post(`${process.env.REACT_APP_API}/addfriend`, { username: username }, { withCredentials: true }).then((res) => {
      if (res.data.code === 200) setStatus(cancelRequest);
    });
  };

  const handleCancelRequest = async () => {
    await axios.post(`${process.env.REACT_APP_API}/cancelfriendrequest`, { username: username }, { withCredentials: true }).then((res) => {
      if (res.data.code === 200) setStatus(addFriend);
    });
  };

  const cancelRequest = (
    <button className="btn btn-primary px-3 rounded-3" onClick={handleCancelRequest}>
      Cancel Friend Request
    </button>
  );
  const addFriend = (
    <button className="btn btn-primary px-3 rounded-3" onClick={handleAddFriend}>
      Add Friend
    </button>
  );

  const formatTime = (timestamp) => {
    const now = dayjs();
    const createdAt = dayjs(timestamp);
    const diff = now.diff(createdAt, "second");
    if (diff < 60) return `${diff}s ago`;
    else if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    else if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    else if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    else return createdAt.format("MMM D, YYYY");
  };

  return (
    <>
      <NavBar />
      <div className="d-flex flex-column align-items-center" style={{ backgroundColor: "#eeeeee" }}>
        <div className="container d-flex flex-column py-4" style={{ maxWidth: "700px" }}>
          <div className="d-flex flex-row">
            <div className="border rounded-pill border-black border-3 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="grey" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            </div>
            <div className="d-flex flex-column p-4 gap-3" style={{ width: "100%" }}>
              <div className="d-flex flex-row justify-content-between">
                <div className="fs-4 fw-semibold">{userData?.userInfo.username}</div>
                {status}
              </div>
              <div>{userData?.userInfo.bio}</div>
            </div>
          </div>
          <div className="mt-4 mb-2">
            <ul className="nav nav-tabs nav-fill d-flex">
              <button className={selected === "created" ? "nav-link active fw-semibold" : "nav-link clickable"} href="/" onClick={() => setSelected("created")}>
                Quizzes created
              </button>
              <button className={selected === "taken" ? "nav-link active fw-semibold" : "nav-link clickable"} href="/" onClick={() => setSelected("taken")}>
                Quizzes taken
              </button>
              <button className={selected === "friends" ? "nav-link active fw-semibold" : "nav-link clickable"} href="/" onClick={() => setSelected("friends")}>
                Friends
              </button>
            </ul>
          </div>
          {selected === "created" &&
            userData?.quizzes_created.map((quiz, index) => (
              <div key={index} className="card p-3 my-1 d-flex flex-column gap-2 clickable" onClick={() => navigate(`/quiz/${quiz._id}`)}>
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <div className="d-flex flex-row gap-2 align-items-center position-relative">
                    <div className="card">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" className="bi bi-person-fill mx-1" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      </svg>
                    </div>
                    <div className="d-flex flex-column">
                      <div className="fw-semibold">{quiz.owner_username}</div>
                      <div>{formatTime(quiz.createdAt)}</div>
                    </div>
                  </div>
                </div>
                <div className="px-3">
                  <div className="fw-semibold">{quiz.title}</div>
                  <div>{quiz.description}</div>
                </div>
              </div>
            ))}
          {selected === "taken" &&
            userData?.quizzes_taken.map((quiz, index) => (
              <div className="card p-3 px-5 d-flex flex-row justify-content-between mx-2 my-1 clickable" onClick={() => navigate(`/quizresult/${quiz._id}`)} key={index}>
                <div>
                  <div className="fw-semibold fs-5">{quiz.quiz_id?.title.toString()}</div>
                  <div>{formatTime(quiz.createdAt)}</div>
                </div>
                <div className="fw-semibold fs-5">{quiz.score + "/" + quiz.questions.length}</div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default UserProfile;
