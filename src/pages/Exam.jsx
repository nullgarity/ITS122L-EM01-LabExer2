import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../data/react_questions.json';

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

  // question navigation buttons
  function renderJumpButtons() {
    return (
      <div style={{ margin: '20px 0', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {questions.map((q, idx) => (
          <button
            key={q.id}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: idx === current ? '#007bff' : (answers[q.id] !== undefined ? '#d4edda' : '#f8d7da'),
              color: idx === current ? '#fff' : '#222',
              border: '1px solid #ccc',
              fontWeight: idx === current ? 700 : 400,
              cursor: 'pointer',
              outline: 'none',
            }}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'Arial, sans-serif' }}>
      {renderJumpButtons()}
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
    </div>
  );
}

export default Exam;
