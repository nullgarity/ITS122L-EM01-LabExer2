import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../data/react_questions.json';
import './Exam.css';
import Timer from './Timer';

function Exam() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const currentQuestion = questions[current];

  function handleAnswerChange(value) {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  }

  function handleSubmit() {
    let calculatedScore = 0;
    questions.forEach((q) => {
      const userAns = answers[q.id];
      if (q.type === 'multiple' || q.type === 'binary') {
        if (userAns !== undefined && String(userAns).toLowerCase() === String(q.answer).toLowerCase()) {
          calculatedScore++;
        }
      } else if (q.type === 'identification') {
        if (userAns !== undefined && userAns.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
          calculatedScore++;
        }
      }
    });
    navigate('/results', { state: { answers, score: calculatedScore } });
  }

  function renderQuestion() {
    switch (currentQuestion.type) {
      case 'multiple':
        return (
          <div>
            <h3 className="question-text">{currentQuestion.question}</h3>
            <div className="choices">
              {currentQuestion.choices.map((choice) => (
                <label key={choice.id}>
                  <input
                    type="radio"
                    name={`q${currentQuestion.id}`}
                    value={choice.id}
                    checked={answers[currentQuestion.id] === choice.id}
                    onChange={() => handleAnswerChange(choice.id)}
                  />
                  {choice.value}
                </label>
              ))}
            </div>
          </div>
        );
      case 'binary':
        return (
          <div>
            <h3 className="question-text">{currentQuestion.question}</h3>
            <div className="choices">
              <label>
                <input
                  type="radio"
                  name={`q${currentQuestion.id}`}
                  value="true"
                  checked={answers[currentQuestion.id] === true}
                  onChange={() => handleAnswerChange(true)}
                />
                True
              </label>
              <label>
                <input
                  type="radio"
                  name={`q${currentQuestion.id}`}
                  value="false"
                  checked={answers[currentQuestion.id] === false}
                  onChange={() => handleAnswerChange(false)}
                />
                False
              </label>
            </div>
          </div>
        );
      case 'identification':
        return (
          <div>
            <h3 className="question-text">{currentQuestion.question}</h3>
            <input
              type="text"
              className="identification-input"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here"
            />
          </div>
        );
      default:
        return <div>Unknown question type</div>;
    }
  }

  function renderJumpButtons() {
    // Split questions into two rows of 10
    const row1 = questions.slice(0, 10);
    const row2 = questions.slice(10, 20);

    const renderRow = (row, offset) => (
      <div className="jump-buttons-row">
        {row.map((q, idx) => {
          const index = offset + idx;
          const isActive = index === current;
          const isAnswered = answers[q.id] !== undefined;
          const buttonClass = isActive ? 'active' : isAnswered ? 'answered' : '';
          return (
            <button
              key={q.id}
              className={buttonClass}
              onClick={() => setCurrent(index)}
              aria-label={`Go to question ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    );

    return (
      <div className="jump-buttons">
        {renderRow(row1, 0)}
        {renderRow(row2, 10)}
      </div>
    );
  }

return (
  <div className="exam-container">
    <Timer duration={30} onTimeUp={handleSubmit} />

    {renderJumpButtons()}
    {renderQuestion()}
    <div className="navigation-buttons">
      <button
        onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
        disabled={current === 0}
      >
        Previous
      </button>
      {current < questions.length - 1 ? (
        <button onClick={() => setCurrent((prev) => Math.min(prev + 1, questions.length - 1))}>
          Next
        </button>
      ) : (
        <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}>
          Submit
        </button>
      )}
    </div>
    <p className="progress-text">
      Question {current + 1} of {questions.length}
    </p>
  </div>
);
}

export default Exam;
