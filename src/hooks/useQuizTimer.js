"use client"

import { useState, useEffect } from "react"

export const useQuizTimer = (onTimeUp) => {
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [timer, setTimer] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = (timeLimit) => {
    setQuizStarted(true)
    setTimeRemaining(timeLimit * 60)
    const intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    setTimer(intervalId)
  }

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [timer])

  return {
    timeRemaining,
    quizStarted,
    startTimer,
    formatTime,
  }
}
