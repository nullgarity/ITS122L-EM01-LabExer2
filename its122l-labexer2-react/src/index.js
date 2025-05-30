import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import questions from './data/react_questions.json';

function App() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // store user answers by question id
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[current];

  // Handle answer selection or input change
  function handleAnswerChange(value) {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  }

  // Check answers and calculate score on submit
  function handleSubmit() {
    let calculatedScore = 0;
    questions.forEach((q) => {
      const userAns = answers[q.id];
      if (q.type === 'multiple' || q.type === 'binary') {
        // For multiple and binary, answer is a string or boolean
        if (userAns !== undefined && String(userAns).toLowerCase() === String(q.answer).toLowerCase()) {
          calculatedScore++;
        }
      } else if (q.type === 'identification') {
        if (userAns !== undefined && userAns.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
          calculatedScore++;
        }
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
  }

  // Render the input field for the current question based on type
  function renderQuestion() {
    if (submitted) {
      // After submit, show question, user answer, and correct answer
      return (
        <div>
          <h3>{currentQuestion.question}</h3>
          <p><b>Your answer:</b> {answers[currentQuestion.id] !== undefined ? String(answers[currentQuestion.id]) : 'No answer'}</p>
          <p><b>Correct answer:</b> {String(currentQuestion.answer)}</p>
        </div>
      );
    }

    switch (currentQuestion.type) {
      case 'multiple':
        return (
          <div>
            <h3>{currentQuestion.question}</h3>
            {currentQuestion.choices.map((choice) => (
              <label key={choice.id} style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="radio"
                  name={`q${currentQuestion.id}`}
                  value={choice.id}
                  checked={answers[currentQuestion.id] === choice.id}
                  onChange={() => handleAnswerChange(choice.id)}
                />{' '}
                {choice.value}
              </label>
            ))}
          </div>
        );
      case 'binary':
        return (
          <div>
            <h3>{currentQuestion.question}</h3>
            <label style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name={`q${currentQuestion.id}`}
                value="true"
                checked={answers[currentQuestion.id] === true}
                onChange={() => handleAnswerChange(true)}
              />{' '}
              True
            </label>
            <label>
              <input
                type="radio"
                name={`q${currentQuestion.id}`}
                value="false"
                checked={answers[currentQuestion.id] === false}
                onChange={() => handleAnswerChange(false)}
              />{' '}
              False
            </label>
          </div>
        );
      case 'identification':
        return (
          <div>
            <h3>{currentQuestion.question}</h3>
            <input
              type="text"
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

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      {!submitted ? (
        <>
          {renderQuestion()}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              disabled={current === 0}
              style={{ marginRight: '10px' }}
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
          <p style={{ marginTop: '10px' }}>
            Question {current + 1} of {questions.length}
          </p>
        </>
      ) : (
        <div>
          <h2>Exam Complete!</h2>
          <p>
            Your score is {score} out of {questions.length}.
          </p>
          <button onClick={() => {
            setSubmitted(false);
            setAnswers({});
            setScore(0);
            setCurrent(0);
          }}>
            Retake Exam
          </button>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);