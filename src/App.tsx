import { useState, useEffect } from 'react'

function App() {
  const [maxNumber, setMaxNumber] = useState<number>(9)
  const [focusNumber, setFocusNumber] = useState<number | null>(null)
  const [currentCard, setCurrentCard] = useState<{ a: number; b: number }>({ a: 0, b: 0 })
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 })

  const generateNewCard = () => {
    let a, b
    if (focusNumber !== null) {
      a = focusNumber
      b = Math.floor(Math.random() * maxNumber) + 1
    } else {
      a = Math.floor(Math.random() * maxNumber) + 1
      b = Math.floor(Math.random() * maxNumber) + 1
    }
    setCurrentCard({ a, b })
    setUserAnswer('')
    setIsCorrect(null)
  }

  useEffect(() => {
    generateNewCard()
  }, [maxNumber, focusNumber])

  const handleSubmit = () => {
    const correctAnswer = currentCard.a * currentCard.b
    const isAnswerCorrect = parseInt(userAnswer) === correctAnswer
    setIsCorrect(isAnswerCorrect)
    setScore(prev => ({
      correct: prev.correct + (isAnswerCorrect ? 1 : 0),
      total: prev.total + 1
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Multiplication Flash Cards</h1>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Practice up to:
          </label>
          <input
            type="number"
            min="1"
            max="15"
            value={maxNumber}
            onChange={(e) => setMaxNumber(Math.min(15, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Focus on number (optional):
          </label>
          <input
            type="number"
            min="1"
            max={maxNumber}
            value={focusNumber || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : null
              setFocusNumber(value ? Math.min(maxNumber, Math.max(1, value)) : null)
            }}
            placeholder="Leave empty for random"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="text-4xl font-bold text-center mb-4 text-gray-800">
            {currentCard.a} × {currentCard.b} = ?
          </div>

          <div className="mb-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCorrect !== null}
            />
          </div>

          {isCorrect !== null && (
            <div className={`text-center mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : `Incorrect. The answer is ${currentCard.a * currentCard.b}`}
            </div>
          )}

          <div className="flex justify-center">
            {isCorrect === null ? (
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!userAnswer}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={generateNewCard}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next Question
              </button>
            )}
          </div>
        </div>

        <div className="text-center text-gray-700">
          Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
        </div>
      </div>
    </div>
  )
}

export default App
