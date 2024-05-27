import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import Lobby from "./components/Lobby";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("quiz-multiplayer-backend-khsjxqfe0-ankits-projects-2e1e4acf.vercel.app", {
  withCredentials: true,
});

function App() {
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomName, setRoomName] = useState();

  const changeRoomCreated = (data) => {
    setRoomCreated(true);
    setRoomName(data);
  };

  return (
    <>
      {!roomCreated && (
        <Lobby socket={socket} onRoomCreation={changeRoomCreated}></Lobby>
      )}
      {roomCreated && <Quiz room={roomName} socket={socket} />}
    </>
  );
}

export default App;
