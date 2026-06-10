import { useState } from 'react'
import { useLang } from '../LangContext.js'
import { t } from '../i18n.js'

const DEALS = [
  { id: 1, name: 'Acme Corp — Enterprise Renewal', stage: 'Proposal Sent', amount: '$120,000', contact: 'Sarah Chen', confidence: 95 },
  { id: 2, name: 'Acme Corp — New Module Add-on', stage: 'Qualification', amount: '$18,000', contact: 'David Park', confidence: 72 },
]

export default function DealMatch({ crm, onSelect, onBack }) {
  const T = t[useLang()]
  const [selected, setSelected] = useState(DEALS[0].id)
  const [creating, setCreating] = useState(false)
  const [newDeal, setNewDeal] = useState({ name: '', company: '', amount: '' })

  const crmName = crm === 'salesforce' ? 'Salesforce' : 'Hubspot'
  const dealLabel = crm === 'salesforce' ? 'Opportunity' : 'Deal'

  function handleCreate() {
    if (!newDeal.name.trim()) return
    onSelect({ id: 99, name: newDeal.name, stage: 'Prospecting', amount: newDeal.amount || '—', contact: '—', company: newDeal.company, confidence: null })
  }

  return (
    <div className="flex-1 flex flex-col">
      <StepHeader step={2} total={4} crm={crmName} onBack={onBack} title={`${T.stepDeal} ${dealLabel}`} T={T} />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          {!creating ? (
            <>
              <p className="text-sm text-gray-400">{T.aiFoundDeals} {dealLabel}：</p>
              {DEALS.map(d => (
                <DealCard key={d.id} deal={d} selected={selected === d.id} matchBadge={T.matchBadge} onSelect={() => setSelected(d.id)} />
              ))}
              <button onClick={() => setCreating(true)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-dashed border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 transition-colors">
                <span className="text-lg">＋</span> {T.createNewDeal} {dealLabel}
              </button>
            </>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
              <p className="font-medium text-sm">{T.createNewDeal} {dealLabel}</p>
              <Field label={T.dealName} value={newDeal.name} onChange={v => setNewDeal(d => ({...d, name: v}))} placeholder="Acme Corp — Q4 Expansion" />
              <Field label={T.company} value={newDeal.company} onChange={v => setNewDeal(d => ({...d, company: v}))} placeholder="Acme Corp" />
              <Field label={T.amount} value={newDeal.amount} onChange={v => setNewDeal(d => ({...d, amount: v}))} placeholder="$50,000" />
              <div className="flex gap-2 mt-1">
                <button onClick={() => setCreating(false)} className="flex-1 border border-gray-700 hover:bg-gray-800 text-sm py-2 rounded-lg transition-colors text-gray-400">{T.cancelBtn}</button>
                <button onClick={handleCreate} className="flex-1 bg-violet-600 hover:bg-violet-500 text-sm font-medium py-2 rounded-lg transition-colors">{T.createAndContinue}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!creating && (
        <div className="p-4 border-t border-gray-800">
          <div className="max-w-xl mx-auto">
            <button onClick={() => onSelect(DEALS.find(d => d.id === selected))}
              className="w-full bg-violet-600 hover:bg-violet-500 py-3 rounded-xl font-medium transition-colors">
              {T.continueWith} {dealLabel} {T.continue}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DealCard({ deal, selected, matchBadge, onSelect }) {
  return (
    <button onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected ? 'border-violet-500 bg-violet-900/20' : 'border-gray-800 bg-gray-900 hover:border-gray-600'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{deal.name}</p>
            {deal.confidence && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${deal.confidence >= 90 ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                {deal.confidence}{matchBadge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
            <span>📊 {deal.stage}</span>
            <span>💰 {deal.amount}</span>
            <span>👤 {deal.contact}</span>
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selected ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-600" />
    </div>
  )
}

export function StepHeader({ step, total, crm, title, onBack, T }) {
  return (
    <div className="border-b border-gray-800 px-4 py-3 flex items-center gap-3">
      <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors text-lg leading-none">←</button>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{T?.back ? `${step}/${total}` : `步骤 ${step}/${total}`}</span>
          <span className="text-xs text-gray-700">·</span>
          <span className="text-xs text-gray-500">{crm}</span>
        </div>
        <p className="font-medium text-sm mt-0.5">{title}</p>
      </div>
      <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  )
}
