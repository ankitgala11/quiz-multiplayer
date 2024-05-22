import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Results from "./Results";

const Quiz = ({ room, socket }) => {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([]);
	const [answered, setAnswered] = useState(false);
	const [seconds, setSeconds] = useState();
	const [end, setEnd] = useState(false);
	const [scores, setScores] = useState(undefined);
	const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
	const [results, setResults] = useState(null);

	useEffect(() => {
		socket.on("message", (message) => {
			toast(`${message}`, {
				position: "top-right",
				autoClose: 200,
				closeOnClick: true,
				pauseOnHover: false,
				theme: "light",
			});
		});
		return () => {
			socket.off("message");
		};
	}, []);

	useEffect(() => {
		socket.on("newQuestion", (data) => {
			setQuestion(data.question);
			setOptions(data.answers);
			setAnswered(false);
			setSeconds(data.timer);
			setSelectedAnswerIndex();
		});

		socket.on("gameOver", (data) => {
			setResults(data.results);
			setEnd(true);
		});

		return () => {
			socket.off("newQuestion");
			socket.off("gameOver");
		};
	}, []);

	useEffect(() => {
		if (seconds === 0) return;

		const timerInterval = setInterval(() => {
			setSeconds((prevTime) => prevTime - 1);
		}, 1000);

		return () => {
			clearInterval(timerInterval);
		};
	}, [seconds]);

	useEffect(() => {
		socket.on("answerResult", (data) => {
			setScores(data.scores);
		});

		return () => {
			socket.off("answerResult");
		};
	}, []);

	const handleAnswer = (answerIndex) => {
		if (!answered) {
			setSelectedAnswerIndex(answerIndex);
			socket.emit("submitAnswer", room, answerIndex);
			setAnswered(true);
		}
	};

	if (question) {
		return (
			<div className="col-sm-10 mx-auto p-3">
				{end && <Results results={results} />}

				{!end && (
					<div className="quiz-div container">
						<ToastContainer />
						<div className="row">
							<div className="col-sm-12">
								<p>Remaining Time: {seconds}</p>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-12">
								<div className="question">
									<p className="question-text">{question}</p>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-12">
								<ul className="list-group">
									{options.map((answer, index) => (
										<li
											key={index}
											className="list-group-item"
										>
											<button
												className={`btn btn-light btn-block ${
													selectedAnswerIndex ===
													index
														? "selected"
														: ""
												}`}
												onClick={() =>
													handleAnswer(index)
												}
												disabled={answered}
											>
												{answer}
											</button>
										</li>
									))}
								</ul>
							</div>
						</div>
						{scores && (
							<div className="row">
								<div className="col-sm-12">
									{scores.map((player, index) => (
										<p key={index}>
											{player.name}: {player.score}
										</p>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div className="container h-screen">
				<div className="flex justify-center items-center h-full">
					<div className="w-full md:w-2/3 lg:w-1/2">
						<div
							className="alert alert-warning my-3 p-3"
							role="alert"
						>
							Please wait for the opponent to join!
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Quiz;
