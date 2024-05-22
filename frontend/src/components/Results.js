import React from "react";

const Results = ({ results }) => {
  return (
    <div className="container">
      <h1>{results.tie ? "It's a draw" : `Winner is ${results.winner}`}</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(results.score).map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
