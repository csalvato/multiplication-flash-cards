import { useState, useEffect } from 'react'

function App() {
  const [maxNumber, setMaxNumber] = useState<number>(9)
  const [currentCard, setCurrentCard] = useState<{ a: number; b: number }>({ a: 0, b: 0 })
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 })

  const generateNewCard = () => {
    const a = Math.floor(Math.random() * maxNumber) + 1
    const b = Math.floor(Math.random() * maxNumber) + 1
    setCurrentCard({ a, b })
    setShowAnswer(false)
  }

  useEffect(() => {
    generateNewCard()
  }, [maxNumber])

  const handleCheckAnswer = (userAnswer: number) => {
    const correctAnswer = currentCard.a * currentCard.b
    setScore(prev => ({
      correct: prev.correct + (userAnswer === correctAnswer ? 1 : 0),
      total: prev.total + 1
    }))
    generateNewCard()
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

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="text-4xl font-bold text-center mb-4 text-gray-800">
            {currentCard.a} × {currentCard.b} = ?
          </div>
          {showAnswer && (
            <div className="text-3xl font-bold text-center text-green-600 mb-4">
              {currentCard.a * currentCard.b}
            </div>
          )}
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleCheckAnswer(currentCard.a * currentCard.b)}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Correct
          </button>
          <button
            onClick={() => handleCheckAnswer(-1)}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Incorrect
          </button>
        </div>

        <div className="text-center text-gray-700">
          Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
        </div>
      </div>
    </div>
  )
}

export default App
