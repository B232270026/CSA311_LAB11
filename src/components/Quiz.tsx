import React, { useState, useEffect } from 'react';
import './Quiz.css';
import QuizCore from '../core/QuizCore';
import QuizQuestion from '../core/QuizQuestion';

// function component
const Quiz: React.FC = () => {
  // Create an instance of QuizCore to manage the logic
  const [quizCore] = useState(new QuizCore());// buh logiciig udirdana
  
 
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(quizCore.getCurrentQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(quizCore.getTotalQuestions()).fill(null));
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>(Array(quizCore.getTotalQuestions()).fill(false));
  

  const [questionBank, setQuestionBank] = useState<QuizQuestion[]>([currentQuestion].filter(Boolean) as QuizQuestion[]);


  const handleOptionSelect = (option: string): void => {
    setSelectedAnswer(option);
    

    const updatedAnswers = [...userAnswers];
    updatedAnswers[quizCore.getCurrentQuestionIndex()] = option;
    setUserAnswers(updatedAnswers);
    

    const isCorrect = option === currentQuestion?.correctAnswer;
    const updatedCorrectAnswers = [...correctAnswers];
    updatedCorrectAnswers[quizCore.getCurrentQuestionIndex()] = isCorrect;
    setCorrectAnswers(updatedCorrectAnswers);
  }


  const handleNextQuestion = (): void => {
    if (quizCore.hasNextQuestion()) {

      if (selectedAnswer) {
        quizCore.answerQuestion(selectedAnswer);
      }
      
      quizCore.nextQuestion();
      const nextQuestion = quizCore.getCurrentQuestion();
      setCurrentQuestion(nextQuestion);
      
      if (nextQuestion && !questionBank.some(q => q.question === nextQuestion.question)) {
        setQuestionBank([...questionBank, nextQuestion]);
      }
      

      setSelectedAnswer(userAnswers[quizCore.getCurrentQuestionIndex()] || null);
    }
  }


  const handlePreviousQuestion = (): void => {
    if (quizCore.hasPreviousQuestion()) {
      quizCore.previousQuestion();
      const prevQuestion = quizCore.getCurrentQuestion();
      setCurrentQuestion(prevQuestion);
 
      setSelectedAnswer(userAnswers[quizCore.getCurrentQuestionIndex()] || null);
    }
  }


  const handleFinishQuiz = (): void => {

    if (selectedAnswer) {
      quizCore.answerQuestion(selectedAnswer);
    }
    

    const finalScore = correctAnswers.filter(isCorrect => isCorrect).length;
    setScore(finalScore);
    setQuizCompleted(true);
  }


  const handleTryAgain = (): void => {

    quizCore.resetQuiz();
    const firstQuestion = quizCore.getCurrentQuestion();
    setCurrentQuestion(firstQuestion);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setScore(0);
    setUserAnswers(Array(quizCore.getTotalQuestions()).fill(null));
    setCorrectAnswers(Array(quizCore.getTotalQuestions()).fill(false));
    setQuestionBank([firstQuestion].filter(Boolean) as QuizQuestion[]);
  }


  if (quizCompleted) {
    return (
      <div className="quiz-container result-container">
        <h2>Quiz Completed!</h2>
        <p className="final-score">Your Final Score: {score} out of {quizCore.getTotalQuestions()}</p>
        <p className="score-percentage">
          {Math.round((score / quizCore.getTotalQuestions()) * 100)}% Correct
        </p>
        
        <div className="statistics">
          <h3>Question Statistics:</h3>
          {questionBank.map((question, index) => (
            <div key={index} className={`stat-item ${correctAnswers[index] ? 'correct-answer' : 'incorrect-answer'}`}>
              <p className="stat-question"><strong>Q{index + 1}:</strong> {question.question}</p>
              <p>Your answer: <span className={correctAnswers[index] ? 'correct' : 'incorrect'}>
                {userAnswers[index] || 'Not answered'}
              </span></p>
              {!correctAnswers[index] && <p>Correct answer: <span className="correct">{question.correctAnswer}</span></p>}
            </div>
          ))}
        </div>
        
        <button onClick={handleTryAgain} className="try-again-btn">
          Try Again
        </button>
      </div>
    );
  }


  if (!currentQuestion) {
    return <div className="quiz-container">Loading questions...</div>;
  }


  const isFirstQuestion = quizCore.getCurrentQuestionIndex() === 0;
  const isLastQuestion = quizCore.getCurrentQuestionIndex() === quizCore.getTotalQuestions() - 1;
  

  const progressPercentage = ((quizCore.getCurrentQuestionIndex()) / quizCore.getTotalQuestions()) * 100;

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <h2>Question {quizCore.getCurrentQuestionIndex() + 1} of {quizCore.getTotalQuestions()}</h2>
      <p className="question">{currentQuestion.question}</p>
    
      <h3>Options:</h3>
      <ul className="options-list">
        {currentQuestion.options.map((option) => {
          let className = "option-item";
          
          // Apply styling based on selection only
          if (selectedAnswer === option) {
            className += " selected";
          }
          
          return (
            <li
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={className}
            >
              {option}
            </li>
          );
        })}
      </ul>


      <div className="button-container">
        {!isFirstQuestion && (
          <button 
            onClick={handlePreviousQuestion}
            className="back-btn"
          >
            Back
          </button>
        )}
        
     
        {!isLastQuestion ? (
          <button 
            onClick={handleNextQuestion}
            className="next-btn"
            disabled={!selectedAnswer}
          >
            Next
          </button>
        ) : (
         
          <button 
            onClick={handleFinishQuiz}
            className="finish-btn"
            disabled={!selectedAnswer}
          >
            Finish Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;