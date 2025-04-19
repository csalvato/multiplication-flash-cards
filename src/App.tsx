import { useState, useEffect } from 'react'

type Operation = 'multiplication' | 'division'

function App() {
  const [maxNumber, setMaxNumber] = useState<number>(12)
  const [focusNumber, setFocusNumber] = useState<number | null>(null)
  const [operation, setOperation] = useState<Operation>('multiplication')
  const [currentCard, setCurrentCard] = useState<{ a: number; b: number }>({ a: 0, b: 0 })
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isCorrect === null && !showAnswer && userAnswer) {
          handleSubmit()
        } else if (isCorrect === false && !showAnswer) {
          setUserAnswer('')
          setIsCorrect(null)
        } else if (isCorrect === true || showAnswer) {
          generateNewCard()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isCorrect, showAnswer, userAnswer])

  const generateNewCard = () => {
    let a, b
    if (operation === 'multiplication') {
      if (focusNumber !== null) {
        a = focusNumber
        b = Math.floor(Math.random() * maxNumber) + 1
      } else {
        a = Math.floor(Math.random() * maxNumber) + 1
        b = Math.floor(Math.random() * maxNumber) + 1
      }
    } else {
      // For division, we want whole number results
      if (focusNumber !== null) {
        a = focusNumber * (Math.floor(Math.random() * maxNumber) + 1)
        b = focusNumber
      } else {
        b = Math.floor(Math.random() * maxNumber) + 1
        a = b * (Math.floor(Math.random() * maxNumber) + 1)
      }
    }
    setCurrentCard({ a, b })
    setUserAnswer('')
    setIsCorrect(null)
    setShowAnswer(false)
  }

  useEffect(() => {
    generateNewCard()
  }, [maxNumber, focusNumber, operation])

  const handleSubmit = () => {
    const correctAnswer = operation === 'multiplication'
      ? currentCard.a * currentCard.b
      : currentCard.a / currentCard.b
    const isAnswerCorrect = parseInt(userAnswer) === correctAnswer
    setIsCorrect(isAnswerCorrect)
    if (isAnswerCorrect) {
      setScore(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1
      }))
    }
  }

  const handleShowAnswer = () => {
    setShowAnswer(true)
    setScore(prev => ({
      correct: prev.correct,
      total: prev.total + 1
    }))
  }

  const handleKeyPress = (digit: string) => {
    if (isCorrect !== null || showAnswer) return
    setUserAnswer(prev => prev + digit)
  }

  const handleBackspace = () => {
    if (isCorrect !== null || showAnswer) return
    setUserAnswer(prev => prev.slice(0, -1))
  }

  const handleClear = () => {
    if (isCorrect !== null || showAnswer) return
    setUserAnswer('')
  }

  const isKeypadDisabled = isCorrect !== null || showAnswer

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {operation === 'multiplication' ? 'Multiplication' : 'Division'} Flash Cards
        </h1>

        <div className="mb-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setOperation('multiplication')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                operation === 'multiplication'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Multiplication
            </button>
            <button
              onClick={() => setOperation('division')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                operation === 'division'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Division
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
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
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Focus on:
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
                placeholder="Random"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg mb-6 ${
          isCorrect === true ? 'bg-green-100' :
          isCorrect === false ? 'bg-red-100' :
          'bg-blue-50'
        }`}>
          <div className="text-4xl font-bold text-center mb-4 text-gray-800">
            {operation === 'multiplication'
              ? `${currentCard.a} × ${currentCard.b} = ?`
              : `${currentCard.a} ÷ ${currentCard.b} = ?`}
          </div>

          <div className="mb-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isMobile ? 'hidden' : ''
              }`}
              disabled={isKeypadDisabled}
            />
            {isMobile && (
              <div className="bg-white p-4 rounded-lg shadow-inner mb-4 text-center text-2xl font-bold">
                {userAnswer || '0'}
              </div>
            )}
          </div>

          {showAnswer && (
            <div className="text-center mb-4 text-blue-600">
              The answer is {operation === 'multiplication'
                ? currentCard.a * currentCard.b
                : currentCard.a / currentCard.b}
            </div>
          )}

          {isMobile && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'C') handleClear()
                    else if (key === '⌫') handleBackspace()
                    else handleKeyPress(key.toString())
                  }}
                  className={`p-4 text-xl font-bold rounded-lg transition-colors ${
                    typeof key === 'number'
                      ? 'bg-gray-200 hover:bg-gray-300'
                      : 'bg-gray-300 hover:bg-gray-400'
                  } ${isKeypadDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isKeypadDisabled}
                >
                  {key}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4">
            {isCorrect === null && !showAnswer ? (
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!userAnswer}
              >
                Check Answer
              </button>
            ) : isCorrect === false && !showAnswer ? (
              <>
                <button
                  onClick={() => {
                    setUserAnswer('')
                    setIsCorrect(null)
                  }}
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleShowAnswer}
                  className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Show Answer
                </button>
              </>
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
