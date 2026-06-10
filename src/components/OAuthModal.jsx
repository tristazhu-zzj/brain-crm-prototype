import { useState } from 'react'
import { useLang } from '../LangContext.js'
import { t } from '../i18n.js'

export default function OAuthModal({ onConnect, onCancel }) {
  const T = t[useLang()]
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleConnect() {
    if (!selected) return
    setLoading(true)
    setTimeout(() => onConnect(selected), 1800)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-sm font-bold">B</div>
          <span className="font-semibold">{T.connectCRM}</span>
        </div>
        <p className="text-sm text-gray-400 mb-5 ml-11">{T.connectDesc}</p>

        <div className="flex flex-col gap-3 mb-5">
          <CRMOption id="salesforce" name="Salesforce" desc={T.sfDesc} logo="☁️"
            color="bg-blue-900/30 border-blue-700" selected={selected === 'salesforce'} onSelect={() => setSelected('salesforce')} />
          <CRMOption id="hubspot" name="Hubspot" desc={T.hsDesc} logo="🟠"
            color="bg-orange-900/30 border-orange-700" selected={selected === 'hubspot'} onSelect={() => setSelected('hubspot')} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">{T.redirecting}</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={onCancel} className="flex-1 border border-gray-700 hover:bg-gray-800 text-sm py-2.5 rounded-xl transition-colors text-gray-400">{T.cancel}</button>
            <button onClick={handleConnect} disabled={!selected}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium py-2.5 rounded-xl transition-colors">
              {T.connect} {selected === 'salesforce' ? 'Salesforce' : selected === 'hubspot' ? 'Hubspot' : 'CRM'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CRMOption({ name, desc, logo, color, selected, onSelect }) {
  return (
    <button onClick={onSelect}
      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${selected ? color + ' scale-[1.01]' : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'}`}>
      <span className="text-2xl">{logo}</span>
      <div className="flex-1">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  )
}
