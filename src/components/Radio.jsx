import { useEffect } from "react";

function Radio(props) {
  const { choices, qNum, selected, handleOptionChange } = props.props;

  useEffect(() => {
    // console.log(choices);
  });

  return (
    <div className="pt-3">
      {choices.map((item, index) => (
        <div className="m-1" key={index}>
          <label className="d-flex gap-2">
            <input
              type="radio"
              checked={index === selected}
              onChange={() => {
                handleOptionChange(qNum, index);
              }}
            />
            {item}
          </label>
        </div>
      ))}
    </div>
  );
}

export default Radio;
