import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import questions from '../data/react_questions.json';
import './Results.css';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers = {}, score = 0 } = location.state || {};

  function getChoiceValue(q, id) {
    const choice = q.choices?.find((c) => c.id === id);
    return choice ? choice.value : id;
  }

  return (
    <div className="results-container">
      <h2>Exam Complete!</h2>
      <p>
        Your score is {score} out of {questions.length}.
      </p>
      <h3>Breakdown:</h3>
      <ol className="results-breakdown">
        {questions.map((q) => {
          const userAns = answers[q.id];
          const isCorrect =
            q.type === 'identification'
              ? userAns && userAns.trim().toLowerCase() === q.answer.trim().toLowerCase()
              : String(userAns).toLowerCase() === String(q.answer).toLowerCase();

          let userDisplay = '';
          let correctDisplay = '';
          let itemClass = 'result-item';
          if (isCorrect) itemClass += ' correct';
          else itemClass += ' incorrect';

          if (q.type === 'multiple') {
            userDisplay = userAns ? getChoiceValue(q, userAns) : 'No answer';
            correctDisplay = getChoiceValue(q, q.answer);
          } else if (q.type === 'binary') {
            userDisplay = userAns === undefined ? 'No answer' : userAns ? 'True' : 'False';
            correctDisplay = q.answer ? 'True' : 'False';
          } else if (q.type === 'identification') {
            userDisplay = userAns || 'No answer';
            correctDisplay = q.answer;
          }

          return (
            <li key={q.id} className={itemClass}>
              <div className="result-question">{q.question}</div>
              <div className="result-your-answer">
                <span>Your answer: </span>
                <span style={{ fontWeight: isCorrect ? 600 : 400 }}>{userDisplay}</span>
              </div>
              {!isCorrect && (
                <div className="result-correct-answer">
                  <span>Correct answer: </span>
                  <span style={{ fontWeight: 600 }}>{correctDisplay}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <button onClick={() => navigate('/exam')}>Retake Exam</button>
    </div>
  );
}

export default Results;
