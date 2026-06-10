import { useState } from 'react'

const DEALS = [
  { id: 1, name: 'Acme Corp — Enterprise Renewal', stage: 'Proposal Sent', amount: '$120,000', contact: 'Sarah Chen', confidence: 95 },
  { id: 2, name: 'Acme Corp — New Module Add-on', stage: 'Qualification', amount: '$18,000', contact: 'David Park', confidence: 72 },
]

export default function DealCard({ crm, onSelect, T, lang }) {
  const dealLabel = crm === 'salesforce' ? 'Opportunity' : 'Deal'
  const [selected, setSelected] = useState(DEALS[0].id)
  const [creating, setCreating] = useState(false)
  const [newDeal, setNewDeal] = useState({ name: '', company: '', amount: '' })

  function handleCreate() {
    if (!newDeal.name.trim()) return
    onSelect({ id: 99, name: newDeal.name, stage: 'Prospecting', amount: newDeal.amount || '—', contact: '—' })
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="text-sm font-medium">{T.aiFoundDeals} {dealLabel}：</p>

      {!creating ? (
        <>
          {DEALS.map(d => (
            <button key={d.id} onClick={() => setSelected(d.id)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selected === d.id ? 'border-violet-500 bg-violet-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selected === d.id ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
                  {selected === d.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{d.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${d.confidence >= 90 ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                      {d.confidence}{T.matchBadge}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>📊 {d.stage}</span><span>💰 {d.amount}</span><span>👤 {d.contact}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          <div className="flex gap-2">
            <button onClick={() => setCreating(true)}
              className="flex-1 text-xs py-2 rounded-lg border border-dashed border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-colors">
              ＋ {T.createNewDeal} {dealLabel}
            </button>
            <button onClick={() => onSelect(DEALS.find(d => d.id === selected))}
              className="flex-1 bg-violet-600 hover:bg-violet-500 text-sm font-medium py-2 rounded-lg transition-colors">
              {T.continueWith} {dealLabel} {T.continue}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          {[
            [T.dealName, 'name', 'Acme Corp — Q4 Expansion'],
            [T.company, 'company', 'Acme Corp'],
            [T.amount, 'amount', '$50,000'],
          ].map(([label, key, placeholder]) => (
            <div key={key}>
              <label className="text-xs text-gray-400 block mb-1">{label}</label>
              <input value={newDeal[key]} onChange={e => setNewDeal(d => ({...d, [key]: e.target.value}))} placeholder={placeholder}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-600" />
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            <button onClick={() => setCreating(false)} className="flex-1 border border-gray-700 hover:bg-gray-800 text-sm py-2 rounded-lg text-gray-400 transition-colors">{T.cancelBtn}</button>
            <button onClick={handleCreate} className="flex-1 bg-violet-600 hover:bg-violet-500 text-sm font-medium py-2 rounded-lg transition-colors">{T.createAndContinue}</button>
          </div>
        </div>
      )}
    </div>
  )
}
