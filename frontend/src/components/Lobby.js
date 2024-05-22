import React, { useEffect, useState } from "react";

const Lobby = ({ socket, onRoomCreation }) => {
  const [name, setName] = useState();
  const [roomName, setRoomName] = useState();

  const createRoom = () => {
    if (!name || !roomName) {
      alert("Enter all fields");
      return;
    }
    socket.emit("create-room", { room: roomName, name });
    socket.on("room-entered", () => {
      onRoomCreation(roomName);
    });
    socket.on("room-error", (data) => {
      alert(data.message);
    });
  };

  const joinRoom = () => {
    if (!name || !roomName) {
      alert("Enter all fields");
      return;
    }
    socket.emit("join-room", { room: roomName, name });
    socket.on("room-entered", (data) => {
      onRoomCreation(roomName);
    });
    socket.on("room-error", (data) => {
      alert(data.message);
    });
  };

  useEffect(() => {
    return () => {
      socket.off("room-entered");
      socket.off("room-error");
    };
  }, [socket]);

  return (
    <div className="col-sm-5 mx-auto my-5 text-center card p-1 shadow-sm border border-light">
      <h4>Create or join room</h4>
      <label className="py-2">
        Name
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Enter your name"
          required={true}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="py-2">
        Room Name
        <input
          type="text"
          className="form-control"
          id="room-name"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </label>
      <div className="row py-3">
        <div className="col">
          <button
            type="button"
            className="btn btn-outline-dark btn-block"
            onClick={createRoom}
          >
            Create Room
          </button>
        </div>
        <div className="col">
          <button
            type="button"
            className="btn btn-outline-primary btn-block"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
