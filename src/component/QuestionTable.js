import React, { useState, useEffect } from "react";

function QuestionTable({ props }) {
  const [title, setShowPopup, handleSubmit, [_id, iQuestion, iChoices, iAnswer], btnText] = props;
  const [question, setQuestion] = useState(iQuestion);
  const [choices, setChoices] = useState(iChoices);
  const [answer, setAnswer] = useState(iAnswer);

  const handleChoiceChange = (index) => (event) => {
    const tempChoices = [...choices];
    tempChoices[index] = event.target.value;
    setChoices(tempChoices);
  };

  const letters = [
    "a. ",
    "b. ",
    "c. ",
    "d. ",
    "e. ",
    "f. ",
    "g. ",
    "h. ",
    "i. ",
    "j. ",
    "k. ",
    "l. ",
    "m. ",
    "n. ",
    "o. ",
    "p. ",
    "q. ",
    "r. ",
    "s. ",
    "t. ",
    "u. ",
    "v. ",
    "w. ",
    "x. ",
    "y. ",
    "z. ",
  ];
  return (
    <>
      <div
        className="d-flex flex-row justify-content-between align-items-start ps-4 pe-3 pt-3"
        style={{ width: "100%" }}>
        <div className="fs-4 fw-semibold">{title}</div>
        <div style={{ width: "100px" }} />
        <button className="btn btn-close" onClick={() => setShowPopup(false)} />
      </div>
      <hr />
      <div className="d-flex flex-column gap-3 px-4 px-sm-5 mt-2">
        <table>
          <tbody>
            <tr>
              <td>
                <input
                  className="form-control fs-5 mb-2"
                  type="text"
                  placeholder=" Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </td>
            </tr>
            {choices.map((choice, index) => (
              <tr key={index}>
                <td>
                  <div className="input-group">
                    <div className="input-group-text" style={{ width: "35px" }}>
                      {letters[index]}
                    </div>
                    <input className="form-control" value={choice} onChange={handleChoiceChange(index)} />
                    <div className="input-group-text">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={index === answer}
                        onChange={() => setAnswer(index)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-end gap-2 mb-4">
          <button className="btn px-3" onClick={() => setShowPopup(false)}>
            Cancel
          </button>
          <button
            className="btn btn-secondary px-4"
            onClick={() =>
              handleSubmit({ _id: _id, question: question, choices: choices, correct_answer: answer })
            }>
            {btnText}
          </button>
        </div>
      </div>
    </>
  );

  <div className="d-flex flex-column gap-3">
    <div className="fs-3">{title}</div>
    <table>
      <tbody>
        <tr>
          <td>
            <input
              className="form-control fs-5 mb-2"
              type="text"
              placeholder=" Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </td>
        </tr>
        {choices.map((choice, index) => (
          <tr key={index}>
            <td>
              <div className="input-group">
                <div className="input-group-text" style={{ width: "35px" }}>
                  {letters[index]}
                </div>
                <input className="form-control" value={choice} onChange={handleChoiceChange(index)} />
                <div className="input-group-text">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={index === answer}
                    onChange={() => setAnswer(index)}
                  />
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="d-flex justify-content-end gap-2">
      <button className="btn px-3" onClick={() => setShowPopup(false)}>
        Cancel
      </button>
      <button
        className="btn btn-secondary px-3"
        onClick={() =>
          handleSubmit({ _id: _id, question: question, choices: choices, correct_answer: answer })
        }>
        {btnText}
      </button>
    </div>
  </div>;
  // );
}

export default QuestionTable;
