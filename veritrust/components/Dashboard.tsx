import React from 'react'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border rounded">
        <h3 className="font-medium">Verified IDs</h3>
        <p className="text-sm text-gray-600">0 (placeholder)</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="font-medium">Avg Credit Score</h3>
        <p className="text-sm text-gray-600">—</p>
      </div>
      <div className="p-4 border rounded">
        <h3 className="font-medium">Blockchain Proofs</h3>
        <p className="text-sm text-gray-600">0</p>
      </div>
    </div>
  )
}
