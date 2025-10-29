import React, { useState } from 'react'

export default function UploadKyc() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus('')
    const f = e.target.files?.[0] ?? null
    setFile(f)
  }

  const submit = async () => {
    if (!file) return setStatus('Please select a file')
    setStatus('Uploading and analyzing... (placeholder)')
    // Placeholder: wire to ML backend / API route
    setTimeout(() => setStatus('KYC analysis queued — results will appear here.'), 1200)
  }

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*,.pdf" onChange={onChange} />
      <div className="flex items-center gap-2">
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Upload & Analyze</button>
        <span className="text-sm text-gray-600">{status}</span>
      </div>
      <div className="text-sm text-gray-500">Supported: government IDs, passport, selfie for face match.</div>
    </div>
  )
}
