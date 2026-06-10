import { useState, useRef, useEffect } from 'react'
import { useLang } from '../LangContext.js'
import { t } from '../i18n.js'
import OAuthCard from './OAuthCard.jsx'
import DealCard from './DealCard.jsx'
import PropertyCard from './PropertyCard.jsx'
import ResultCard from './ResultCard.jsx'

const MEETING = {
  title: 'Q3 Business Review — Acme Corp',
  duration: '52 min',
  participants: ['Sarah Chen (Acme)', 'David Park (Acme)', 'You'],
  summary: {
    zh: '讨论了 Q3 续约条款、预算提升至 $120K、竞品对比（vs Notion AI），Sarah 确认 8 月底前完成签约，下一步安排技术演示。',
    ja: 'Q3 更新条件、予算 $120K への引き上げ、競合比較（vs Notion AI）について議論。Sarah は 8 月末までに契約完了を確認。次のステップはテクニカルデモの設定。',
  },
}

// Each message: { role, text?, card? }
// card: { type: 'oauth'|'deal'|'review'|'result', props, done }
export default function BrainChat() {
  const lang = useLang()
  const T = t[lang]
  const bottomRef = useRef(null)

  const [input, setInput] = useState('')
  const [syncStarted, setSyncStarted] = useState(false)
  const [crm, setCrm] = useState(null)
  const [deal, setDeal] = useState(null)
  // flow: null | 'oauth' | 'deal' | 'review' | 'syncing' | 'done'
  const [flow, setFlow] = useState(null)

  // Extra user-typed messages
  const [extraMessages, setExtraMessages] = useState([])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [flow, extraMessages])

  function handleSync() {
    if (syncStarted) return
    setSyncStarted(true)
    setFlow('oauth')
  }

  function handleSend() {
    if (!input.trim()) return
    const isSyncIntent = /同期|同步|salesforce|hubspot|crm/i.test(input)
    const reply = isSyncIntent
      ? { role: 'assistant', text: T.aiReplyChat, action: true }
      : { role: 'assistant', text: T.aiReplyGeneric }
    setExtraMessages(m => [...m, { role: 'user', text: input }, reply])
    setInput('')
    if (isSyncIntent && !syncStarted) {
      setTimeout(() => handleSync(), 400)
    }
  }

  function onOAuthDone(selectedCrm) {
    setCrm(selectedCrm)
    setFlow('deal')
  }

  function onDealDone(selectedDeal) {
    setDeal(selectedDeal)
    setFlow('review')
  }

  function onSyncConfirmed() {
    setFlow('syncing')
    setTimeout(() => setFlow('done'), 2000)
  }

  const initMessages = [
    { role: 'assistant', text: T.aiGreeting },
    { role: 'user', text: T.userTrigger },
    { role: 'assistant', text: T.aiReply, action: true },
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">

          {[...initMessages, ...extraMessages].map((m, i) => (
            <ChatMessage key={i} m={m} T={T} onSync={handleSync} syncStarted={syncStarted} />
          ))}

          {/* Inline flow cards */}
          {flow === 'oauth' && (
            <AssistantCard>
              <OAuthCard onConnect={onOAuthDone} T={T} />
            </AssistantCard>
          )}

          {flow === 'deal' && (
            <AssistantCard>
              <DealCard crm={crm} onSelect={onDealDone} T={T} lang={lang} />
            </AssistantCard>
          )}

          {flow === 'review' && (
            <AssistantCard>
              <PropertyCard crm={crm} deal={deal} onSync={onSyncConfirmed} T={T} lang={lang} />
            </AssistantCard>
          )}

          {flow === 'syncing' && (
            <AssistantCard>
              <div className="flex items-center gap-3 py-2">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <p className="text-sm text-gray-300">{crm === 'salesforce' ? 'Salesforce' : 'Hubspot'} に同期中...</p>
              </div>
            </AssistantCard>
          )}

          {flow === 'done' && (
            <AssistantCard>
              <ResultCard crm={crm} deal={deal} T={T} />
            </AssistantCard>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={T.inputPlaceholder}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-500" />
          <button onClick={handleSend} className="bg-violet-600 hover:bg-violet-500 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">{T.sendMessage}</button>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ m, T, onSync, syncStarted }) {
  return (
    <div className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
      {m.role === 'assistant' && (
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">B</div>
      )}
      <div className={`flex flex-col gap-2 max-w-[80%] ${m.role === 'user' ? 'items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-100 rounded-tl-sm'}`}>
          {m.text}
        </div>
        {m.action && !syncStarted && (
          <button onClick={onSync} className="self-start bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
            <span>🔗</span><span>{T.startSync}</span><span className="text-gray-500">→</span>
          </button>
        )}
      </div>
    </div>
  )
}

function AssistantCard({ children }) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">B</div>
      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm overflow-hidden">
        {children}
      </div>
    </div>
  )
}
