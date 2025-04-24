import quizData from '../data/quizData';
import QuizQuestion from './QuizQuestion';

/**
 * The `QuizCore` class represents the core logic for managing a quiz, including
 * maintaining the quiz questions, tracking the user's progress, and calculating
 * their score.
 * 
 * It provides methods for navigating through the quiz, answering questions,
 * and retrieving information about the current state of the quiz.
 */
class QuizCore {
  private questions: QuizQuestion[];
  private currentQuestionIndex: number;
  private score: number;
  private userAnswers: (string | null)[];

  /**
   * Constructor
   */
  constructor() {
    this.questions = quizData;
    this.currentQuestionIndex = 0;
    this.score = 0;
    // Initialize user answers array with null values for each question
    this.userAnswers = new Array(this.questions.length).fill(null);
  }

  /**
   * Get the current question.
   * @returns The current question or null if no questions are available.
   */
  public getCurrentQuestion(): QuizQuestion | null {
    // Returns the current quiz question.
    if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.questions.length) {
      return this.questions[this.currentQuestionIndex];
    }
    return null;
  }

  /**
   * Get the current question index.
   * @returns The current question index.
   */
  public getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

  /**
   * Move to the next question.
   */
  public nextQuestion(): void {      
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  /**
   * Move to the previous question.
   */
  public previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  /**
   * Checks if there is a next question available in the quiz.
   *
   * @returns {boolean} True if there is a next question, false if the quiz has been completed.
   */
  public hasNextQuestion(): boolean {
    return this.currentQuestionIndex < this.questions.length - 1;
  }

  /**
   * Checks if there is a previous question available in the quiz.
   *
   * @returns {boolean} True if there is a previous question, false if this is the first question.
   */
  public hasPreviousQuestion(): boolean {
    return this.currentQuestionIndex > 0;
  }

  /**
   * Record the user's answer and update the score.
   * @param answer - The user's answer.
   * @returns {boolean} Whether the answer was correct
   */
  public answerQuestion(answer: string): boolean {
    // Store the user's answer
    this.userAnswers[this.currentQuestionIndex] = answer;
    
    // Records the user's answer and updates the score if the answer is correct.
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion && answer === currentQuestion.correctAnswer) {
      // Only increment score if this is a new correct answer
      if (this.userAnswers[this.currentQuestionIndex] !== currentQuestion.correctAnswer) {
        this.score++;
      }
      return true;
    }
    return false;
  }

  /**
   * Get the user's answer for the current question.
   * @returns The user's answer or null if none.
   */
  public getCurrentAnswer(): string | null {
    return this.userAnswers[this.currentQuestionIndex];
  }

  /**
   * Get the user's score.
   * @returns The user's score.
   */
  public getScore(): number {
    return this.score;
  }

  /**
   * Get the total number of questions in the quiz.
   * @returns The total number of questions.
   */
  public getTotalQuestions(): number {
    return this.questions.length;
  }

  /**
   * Reset the quiz.
   */
  public resetQuiz(): void {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
  }
}

export default QuizCore;