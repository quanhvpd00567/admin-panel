"use client"

import { useState, useEffect } from "react"
import { set } from "react-hook-form"

export const useQuizState = (questions, isShuffleAnswers) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set())
  const [shuffledAnswers, setShuffledAnswers] = useState([])

  const handleAnswerChange = (questionId, answerId, isMultiple = false) => {
    setAnswers((prev) => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || []
        const newAnswers = currentAnswers.includes(answerId)
          ? currentAnswers.filter((id) => id !== answerId)
          : [...currentAnswers, answerId]
        return { ...prev, [questionId]: newAnswers }
      } else {
        return { ...prev, [questionId]: answerId }
      }
    })
  }

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const getAnswerStats = () => {
    const answered = Object.values(answers).filter((answer) =>
      Array.isArray(answer) ? answer.length > 0 : answer !== "",
    ).length
    const flagged = flaggedQuestions.size
    const remaining = questions.length - answered

    return { answered, flagged, remaining, total: questions.length }
  }

  // Shuffle answers when current question changes
  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      const currentQuestion = questions[currentQuestionIndex]
      let shuffled = currentQuestion.answers
      if (isShuffleAnswers) {
        shuffled = [...currentQuestion.answers].sort(() => Math.random() - 0.5)
      }
        setShuffledAnswers(shuffled)
    }
  }, [currentQuestionIndex, questions, isShuffleAnswers])

  return {
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    shuffledAnswers,
    handleAnswerChange,
    goToQuestion,
    goToPrevious,
    goToNext,
    toggleFlag,
    getAnswerStats,
  }
}
