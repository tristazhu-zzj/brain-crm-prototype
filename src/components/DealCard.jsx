import { useState } from 'react'

const DEALS = [
  { id: 1, name: 'Acme Corp — Enterprise Renewal', stage: 'Proposal Sent', amount: '$120,000', contact: 'Sarah Chen', confidence: 95 },
  { id: 2, name: 'Acme Corp — New Module Add-on', stage: 'Qualification', amount: '$18,000', contact: 'David Park', confidence: 72 },
]

// Mock search results
const ALL_DEALS = [
  ...DEALS,
  { id: 3, name: 'Acme Corp — Japan Expansion', stage: 'Prospecting', amount: '$45,000', contact: 'Sarah Chen', confidence: null },
  { id: 4, name: 'Acme Corp — Support Contract', stage: 'Closed Won', amount: '$12,000', contact: 'David Park', confidence: null },
  { id: 5, name: 'Beta Inc — New License', stage: 'Qualification', amount: '$30,000', contact: 'James Wu', confidence: null },
]

export default function DealCard({ crm, onSelect, T, lang }) {
  const dealLabel = crm === 'salesforce' ? 'Opportunity' : 'Deal'
  const [selected, setSelected] = useState(DEALS[0].id)
  const [mode, setMode] = useState('recommend') // 'recommend' | 'search' | 'create'
  const [newDeal, setNewDeal] = useState({ name: '', company: '', amount: '' })
  const [searchQ, setSearchQ] = useState('')

  const filtered = ALL_DEALS.filter(d =>
    d.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    d.contact.toLowerCase().includes(searchQ.toLowerCase())
  )

  function handleCreate() {
    if (!newDeal.name.trim()) return
    onSelect({ id: 99, name: newDeal.name, stage: 'Prospecting', amount: newDeal.amount || '—', contact: '—' })
  }

  const selectedDeal = ALL_DEALS.find(d => d.id === selected)

  return (
    <div className="p-4 flex flex-col gap-3">

      {mode === 'recommend' && (
        <>
          <p className="text-sm font-medium">{T.aiFoundDeals} {dealLabel}：</p>
          {DEALS.map(d => (
            <DealRow key={d.id} deal={d} selected={selected === d.id} matchBadge={T.matchBadge} onSelect={() => setSelected(d.id)} />
          ))}
          <div className="flex gap-2">
            <button onClick={() => setMode('search')}
              className="flex-1 text-xs py-2 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-colors">
              🔍 {T.searchDeal} {dealLabel}
            </button>
            <button onClick={() => setMode('create')}
              className="flex-1 text-xs py-2 rounded-lg border border-dashed border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-colors">
              ＋ {T.createNewDeal} {dealLabel}
            </button>
          </div>
          <button onClick={() => onSelect(selectedDeal)}
            className="w-full bg-violet-600 hover:bg-violet-500 text-sm font-medium py-2.5 rounded-xl transition-colors">
            {T.continueWith} {dealLabel} {T.continue}
          </button>
        </>
      )}

      {mode === 'search' && (
        <>
          <div className="flex items-center gap-2">
            <button onClick={() => setMode('recommend')} className="text-gray-500 hover:text-white transition-colors text-sm">←</button>
            <p className="text-sm font-medium">🔍 {T.searchDeal} {dealLabel}</p>
          </div>
          <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder={`${T.searchDealPlaceholder} ${dealLabel}...`}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-600" />
          <div className="flex flex-col gap-2">
            {filtered.map(d => (
              <DealRow key={d.id} deal={d} selected={selected === d.id} matchBadge={T.matchBadge} onSelect={() => setSelected(d.id)} />
            ))}
            {filtered.length === 0 && <p className="text-xs text-gray-500 text-center py-3">{T.noResults}</p>}
          </div>
          {selected && (
            <button onClick={() => onSelect(selectedDeal)}
              className="w-full bg-violet-600 hover:bg-violet-500 text-sm font-medium py-2.5 rounded-xl transition-colors">
              {T.continueWith} {dealLabel} {T.continue}
            </button>
          )}
        </>
      )}

      {mode === 'create' && (
        <>
          <div className="flex items-center gap-2">
            <button onClick={() => setMode('recommend')} className="text-gray-500 hover:text-white transition-colors text-sm">←</button>
            <p className="text-sm font-medium">＋ {T.createNewDeal} {dealLabel}</p>
          </div>
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
            <button onClick={() => setMode('recommend')} className="flex-1 border border-gray-700 hover:bg-gray-800 text-sm py-2 rounded-lg text-gray-400 transition-colors">{T.cancelBtn}</button>
            <button onClick={handleCreate} className="flex-1 bg-violet-600 hover:bg-violet-500 text-sm font-medium py-2 rounded-lg transition-colors">{T.createAndContinue}</button>
          </div>
        </>
      )}
    </div>
  )
}

function DealRow({ deal, selected, matchBadge, onSelect }) {
  return (
    <button onClick={onSelect}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selected ? 'border-violet-500 bg-violet-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selected ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{deal.name}</span>
            {deal.confidence && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${deal.confidence >= 90 ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                {deal.confidence}{matchBadge}
              </span>
            )}
          </div>
          <div className="flex gap-3 mt-1 text-xs text-gray-400">
            <span>📊 {deal.stage}</span><span>💰 {deal.amount}</span><span>👤 {deal.contact}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
