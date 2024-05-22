import React from "react";

const Question = ({ question, onChoiceChange, Users }) => {
  

  const handleClick = (e) => {
    e.preventDefault();
    const selectedIndex = e.target.getAttribute("data-index"); // Get the index of the selected choice
    onChoiceChange(question.id, e.target.value, selectedIndex);
  };

  return (
    <div className="card shadow-sm m-1 p-2">
      <h3>{question.text}</h3>
      <ul className="list-group">
        {question.choices &&
          question.choices.map((choice, index) => {
            return (
              <li className="list-group-item" key={choice.id}>
                {choice.id}{" "}
                <input
                  type="radio"
                  onClick={handleClick}
                  name={question.id}
                  value={choice.id}
                  data-index={index}
                />{" "}
                {choice.text}
              </li>
            );
          })}
      </ul>
      <div className="d-flex justify-content-center mt-2">
        {Object.values(Users).map((user) => (
          <h5 key={user.id} className="mx-2">
            {user.name} <span className="mr-2">{user.score || 0}</span>
          </h5>
        ))}
      </div>
    </div>
  );
};

export default Question;
