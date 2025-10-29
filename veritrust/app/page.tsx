import React from 'react'
import UploadKyc from '../components/UploadKyc'
import CreditForm from '../components/CreditForm'
import Dashboard from '../components/Dashboard'

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-lg font-medium mb-4">KYC Verification</h2>
          <UploadKyc />
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-lg font-medium mb-4">Credit Evaluation</h2>
          <CreditForm />
        </div>
      </section>

      <section className="p-6 bg-white rounded shadow">
        <h2 className="text-lg font-medium mb-4">Analytics Dashboard</h2>
        <Dashboard />
      </section>
    </div>
  )
}
