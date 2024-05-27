import React, { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import Lobby from "./components/Lobby";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("https://quiz-multiplayer-backend-peach.vercel.app:5000/", {
  withCredentials: true
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
