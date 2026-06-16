import { useState, useRef, useEffect } from 'react'
import { useLang } from '../LangContext.js'
import { t } from '../i18n.js'
import OAuthCard from './OAuthCard.jsx'
import DealCard from './DealCard.jsx'
import PropertyCard from './PropertyCard.jsx'
import ResultCard from './ResultCard.jsx'

// Demo toggles — simulate different states
const DEMO = {
  isBusinessMeeting: true,   // AI 判断是否为商谈
  adminConfigured: false,    // 管理员是否已配置
  userHadPersonalConfig: true, // 用户之前是否有个人配置（用于触发管理员接管提示）
}

export default function BrainChat() {
  const lang = useLang()
  const T = t[lang]
  const bottomRef = useRef(null)

  const [input, setInput] = useState('')
  const [syncStarted, setSyncStarted] = useState(false)
  const [crm, setCrm] = useState(null)
  const [deal, setDeal] = useState(null)
  const [flow, setFlow] = useState(null)
  const [extraMessages, setExtraMessages] = useState([])
  // 管理员接管提示是否已显示
  const [adminTakeoverShown, setAdminTakeoverShown] = useState(false)
  // 用户是否完成过个人字段选取（用于后续流程判断）
  const [userConfigDone, setUserConfigDone] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [flow, extraMessages])

  function handleSync() {
    if (syncStarted) return
    setSyncStarted(true)
    // 如果用户有个人配置但管理员刚接管，插入一次性提示消息
    if (DEMO.userHadPersonalConfig && DEMO.adminConfigured && !adminTakeoverShown) {
      setAdminTakeoverShown(true)
      setExtraMessages(m => [...m, {
        role: 'assistant',
        text: T.adminTakeoverNotice,
        isNotice: true,
      }])
      setTimeout(() => setFlow('deal'), 800)
    } else {
      setFlow('oauth')
    }
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

          {/* Recommended quick replies — shown when business meeting detected, before sync started */}
          {DEMO.isBusinessMeeting && !syncStarted && (
            <RecommendChips T={T} onSync={handleSync} adminConfigured={DEMO.adminConfigured} />
          )}

          {/* Inline flow cards */}
          {flow === 'oauth' && (
            <AssistantCard>
              <OAuthCard onConnect={onOAuthDone} T={T} />
            </AssistantCard>
          )}

          {flow === 'deal' && (
            <AssistantCard>
              <DealCard crm={crm || 'salesforce'} onSelect={onDealDone} T={T} lang={lang} />
            </AssistantCard>
          )}

          {flow === 'review' && (
            <AssistantCard>
              <PropertyCard
                crm={crm || 'salesforce'}
                deal={deal}
                onSync={onSyncConfirmed}
                T={T}
                lang={lang}
                adminConfigured={DEMO.adminConfigured}
                onUserConfigDone={() => setUserConfigDone(true)}
              />
            </AssistantCard>
          )}

          {flow === 'syncing' && (
            <AssistantCard>
              <div className="flex items-center gap-3 p-4">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <p className="text-sm text-gray-300">{T.syncing}...</p>
              </div>
            </AssistantCard>
          )}

          {flow === 'done' && (
            <AssistantCard>
              <ResultCard crm={crm || 'salesforce'} deal={deal} T={T} />
            </AssistantCard>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Demo state toggles */}
      <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/50 flex items-center gap-4">
        <span className="text-xs text-gray-600">[Demo 状态]</span>
        <DemoToggle label="商谈会议" value={DEMO.isBusinessMeeting} onChange={v => { DEMO.isBusinessMeeting = v; window.location.reload() }} />
        <DemoToggle label="管理员已配置" value={DEMO.adminConfigured} onChange={v => { DEMO.adminConfigured = v; window.location.reload() }} />
        <DemoToggle label="用户有个人配置" value={DEMO.userHadPersonalConfig} onChange={v => { DEMO.userHadPersonalConfig = v; window.location.reload() }} />
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

// Quick reply chips — recommended actions shown when business meeting detected
function RecommendChips({ T, onSync, adminConfigured }) {
  return (
    <div className="flex gap-3 pl-10">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>💡</span>{T.recommendedActions}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onSync}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-violet-500 text-sm px-3 py-1.5 rounded-xl transition-all"
          >
            <span>🔗</span>
            <span>{T.recommendSyncChip}</span>
          </button>
        </div>
        {!adminConfigured && (
          <p className="text-xs text-gray-600">{T.noAdminConfigHint}</p>
        )}
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
        {m.isNotice ? (
          <div className="bg-amber-900/20 border border-amber-700/40 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-amber-300 leading-relaxed">
            <span className="mr-1">ℹ️</span>{m.text}
          </div>
        ) : (
          <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-100 rounded-tl-sm'}`}>
            {m.text}
          </div>
        )}
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

function DemoToggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} className="accent-violet-500" />
      <span className="text-xs text-gray-500">{label}</span>
    </label>
  )
}
