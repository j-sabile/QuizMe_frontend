import React, { useState, useEffect } from "react";
import QuestionTable from "./QuestionTable";

function AddQuestion({ setShowPopup, addQuestion }) {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState(-1);

  const handleChoiceChange = (index) => (event) => {
    const tempChoices = [...choices];
    tempChoices[index] = event.target.value;
    setChoices(tempChoices);
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="fs-3">Add Question</div>
      <QuestionTable props={[question, choices, answer, setQuestion, handleChoiceChange, setAnswer]} />
      <div className="d-flex justify-content-end gap-2">
        <button className="btn px-3" onClick={() => setShowPopup(false)}>
          Cancel
        </button>
        <button
          className="btn btn-secondary px-3"
          onClick={() => addQuestion({ question: question, choices: choices, correct_answer: answer })}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddQuestion;
