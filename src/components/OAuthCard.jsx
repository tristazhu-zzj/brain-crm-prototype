import { useState } from 'react'

export default function OAuthCard({ onConnect, T }) {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleConnect() {
    if (!selected) return
    setLoading(true)
    setTimeout(() => onConnect(selected), 1500)
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="text-sm font-medium">{T.connectCRM}</p>
      <p className="text-xs text-gray-400">{T.connectDesc}</p>
      <div className="flex flex-col gap-2">
        {[
          { id: 'salesforce', name: 'Salesforce', desc: T.sfDesc, logo: '☁️', active: 'bg-blue-900/30 border-blue-600' },
          { id: 'hubspot', name: 'Hubspot', desc: T.hsDesc, logo: '🟠', active: 'bg-orange-900/30 border-orange-600' },
        ].map(({ id, name, desc, logo, active }) => (
          <button key={id} onClick={() => setSelected(id)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${selected === id ? active : 'border-gray-700 hover:border-gray-600'}`}>
            <span className="text-xl">{logo}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected === id ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
              {selected === id && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          {T.redirecting}
        </div>
      ) : (
        <button onClick={handleConnect} disabled={!selected}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium py-2.5 rounded-xl transition-colors">
          {T.connect} {selected === 'salesforce' ? 'Salesforce' : selected === 'hubspot' ? 'Hubspot' : 'CRM'}
        </button>
      )}
    </div>
  )
}
