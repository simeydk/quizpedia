import React, { useState, useEffect, useRef } from "react"
import Clipboard from 'react-clipboard.js'
import { Link } from "gatsby"

import './mega.css'


import data_general from "../data/quiz_general.json"
import data_trivia from "../data/quiz_trivia.json"
import data_pub from "../data/quiz_pub.json"

const data = [
  { theme: 'General', quizzes: data_general },
  { theme: 'Trivia', quizzes: data_trivia },
  { theme: 'Pub', quizzes: data_pub }
]


function whatsAppText({ q_list, a_list }, includeAnswers = false) {
  return q_list.map((question, i) => `${i + 1}. ${question}${includeAnswers ? `\n*${a_list[i]}*` : ''}`).join('\n\n')
}


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


function QuizGallery({ collections = [] }) {
  const [activeQuiz, setActiveQuiz] = useState({ title: '', q_list: [], a_list: [] })

  return (<div class="page">
    <div class="sidebar">
      {collections.map(coll => <div>
        <h4 class="sidebar-theme-title">{coll.theme}</h4>
        <ol>{coll.quizzes.map(q => <li class="sidebar-quiz-title"><button onClick={_ => setActiveQuiz(q)}>{q.title}</button></li>)}</ol>
      </div>)}
    </div>
    <div class="main">
      <Quiz quiz={activeQuiz} />
    </div>
  </div>)

}

function Quiz({ quiz }) {
  const { title } = quiz
  const previousQuiz = usePrevious(quiz)
  const [showAnswers, setShowAnswers] = useState(false)
  const [showWhatsapp, setShowWhatsapp] = useState(false)
  const toggleShowAnswers = () => setShowAnswers(!showAnswers)
  const toggleShowWhatsapp = () => setShowWhatsapp(!showWhatsapp)

  const wat = whatsAppText(quiz, showAnswers)

  return (
    <div class="quiz">
      <h2>{title}</h2>
      <div class="vert-list">
        <button class="round-button" onClick={toggleShowAnswers}>{showAnswers ? 'Hide' : 'Show'} Answers</button>
        <button class="round-button" onClick={toggleShowWhatsapp}>Show {showWhatsapp ? 'Pretty Formatted' : 'Whatsapp Formatted'}</button>
        <Clipboard className="round-button copy-button" data-clipboard-text={wat}>Copy Whatsapp Text to Clipboard</Clipboard>
      </div>
      {showWhatsapp ?
        <pre className="whatsapp">
          {wat}
        </pre>
        :
        <ol className="pretty">
          {quiz.q_list.map((question, i) => <li className="question-li">
            <p className="question">{question}</p>
            {showAnswers ? <p className="answer" ><b>{quiz.a_list[i]}</b></p> : ''}
          </li>)}
        </ol>
      }
    </div>
  )
}

const QuizPage = () => <QuizGallery collections={data} />

function MegaPage() {
  const [rounds, setRounds] = useState([])
  const [activeNum, setActiveNum] = useState(0)
  const [showAnswers, setShowAnswers] = useState(false)
  const toggleShowAnswers = () => setShowAnswers(!showAnswers)
  const [showWhatsapp, setShowWhatsapp] = useState(false)
  const toggleShowWhatsapp = () => setShowWhatsapp(!showWhatsapp)

  useEffect(() => {
    setRounds(data_general)
  }, [])

  const activeRound = ((activeNum >= 0) && (activeNum < rounds.length)) ? rounds[activeNum] : { title: '', q_list: [], a_list: [] }
  const wat = whatsAppText(activeRound, showAnswers)
  return <div class="mega">
    <h1>All the quiz</h1>
    {/* <pre>{JSON.stringify(rounds, null, 2)}</pre> */}
    <h2>R{activeNum + 1}: {activeRound.title}</h2>
    <div class="round-button-list">
      {rounds.map((round, i) => <button class="round-button" onClick={() => { setActiveNum(i); setShowAnswers(false) }}>{round.title}</button>)}
    </div>
    <div class="vert-list">
      <button class="round-button" onClick={toggleShowAnswers}>{showAnswers ? 'Hide' : 'Show'} Answers</button>
      <button class="round-button" onClick={toggleShowWhatsapp}>Show {showWhatsapp ? 'Pretty Formatted' : 'Whatsapp Formatted'}</button>
      <Clipboard className="round-button copy-button" data-clipboard-text={wat}>Copy Whatsapp Text to Clipboard</Clipboard>
    </div>
    {showWhatsapp ?
      <pre className="whatsapp">
        {wat}
      </pre>
      :
      <ol className="pretty">
        {activeRound.q_list.map((question, i) => <li>
          <p className="question">{question}</p>
          {showAnswers ? <p className="answer" ><b>{activeRound.a_list[i]}</b></p> : ''}
        </li>)}
      </ol>
    }
  </div>
}


export default QuizPage
