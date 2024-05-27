import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Results from "./Results";
import "./style.css";

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
			toast.success(`${message}`, {
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
			<div className="container mt-4">
				{end && <Results results={results} />}

				{!end && (
					<div className="quiz-div container">
						<ToastContainer />
						<div className="row mb-5">
							<div className="col-sm-12">
								<h6 className="text-center">
									Remaining Time: {seconds}
								</h6>
							</div>
						</div>
						<div className="row mb-3">
							<div className="col-sm-12">
								<h2>Q. {question}</h2>
							</div>
						</div>
						<div className="row mb-3">
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
							<div class="container mt-5">
								<h5 class="text-center">Scores</h5>
								<div class="d-flex align-items-center justify-content-between">
									<h6>
										{scores[0].name}:{scores[0].score}
									</h6>
									<h6>
										{scores[1].name}:{scores[1].score}
									</h6>
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
				<div className="flex justify-center">
					<div className="w-full ">
						<div
							className="alert alert-warning items-cente mt-5 p-5 rounded-lg text-center font-weight-bold fs-4"
							role="alert"
							style={{
								animation: "blink 2s infinite",
							}}
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
