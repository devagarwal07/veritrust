import React, { useState } from 'react'

export default function CreditForm() {
  const [age, setAge] = useState<number | ''>('')
  const [income, setIncome] = useState<number | ''>('')
  const [score, setScore] = useState<string>('')

  const evaluate = () => {
    // Simple heuristic placeholder
    if (!age || !income) return setScore('Provide age and income')
    const base = Math.min(850, Math.round((Number(income) / 1000) * 10 + Number(age)))
    setScore(`Estimated score: ${Math.max(300, base)}`)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm">Age</label>
        <input value={age} onChange={e => setAge(e.target.value ? Number(e.target.value) : '')} className="mt-1 block w-full rounded border-gray-200" type="number" />
      </div>
      <div>
        <label className="block text-sm">Monthly Income (USD)</label>
        <input value={income} onChange={e => setIncome(e.target.value ? Number(e.target.value) : '')} className="mt-1 block w-full rounded border-gray-200" type="number" />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={evaluate} className="px-4 py-2 bg-green-600 text-white rounded">Evaluate</button>
        <div className="text-sm text-gray-700">{score}</div>
      </div>
      <div className="text-xs text-gray-500">This is a local heuristic. Replace with ML/heuristic integration to produce formal credit score.</div>
    </div>
  )
}
