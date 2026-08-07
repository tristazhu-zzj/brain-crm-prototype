import { useState } from 'react'
import { t } from '../i18n.js'
import OAuthCard from './OAuthCard.jsx'
import DealCard from './DealCard.jsx'
import PropertyCard from './PropertyCard.jsx'
import ResultCard from './ResultCard.jsx'

const MEETING = {
  title: 'Q3 Business Review — Acme Corp',
  date: '2026-06-10 14:00',
  duration: '52 min',
  participants: ['Sarah Chen (Acme Corp)', 'David Park (Acme Corp)', 'You'],
  summary: {
    zh: 'AI 摘要：讨论了 Q3 续约条款，预算从 $100K 提升至 $120K。竞品对比提及 Notion AI。Sarah 确认 8 月底前完成签约，下一步安排技术演示。',
    ja: 'AI サマリー：Q3 更新条件、予算 $120K への引き上げ、競合比較（Notion AI）を議論。Sarah は 8 月末までに契約完了を確認。次のステップはテクニカルデモの設定。',
  },
  transcript: {
    zh: [
      { speaker: 'Sarah Chen', time: '14:02', text: '我们这次主要想确认一下 Q3 的续约方向，预算方面我们内部已经讨论过了，大概能到 12 万美金。' },
      { speaker: 'You', time: '14:05', text: '好的，那比去年增加了不少。我们会根据新预算重新整理一份方案，大概一周内发给你们。' },
      { speaker: 'David Park', time: '14:08', text: '对了，我们最近也在看 Notion AI 的方案，所以希望你们的方案能更突出一些差异点。' },
      { speaker: 'Sarah Chen', time: '14:15', text: '我们希望 8 月底之前能完成签约，你们这边时间上没问题吧？' },
      { speaker: 'You', time: '14:17', text: '没问题，我们会尽快安排技术演示，预计 7 月第二周可以做。' },
    ],
    ja: [
      { speaker: 'Sarah Chen', time: '14:02', text: 'Q3 の更新方針を確認したいと思います。予算は社内で検討済みで、約 12 万ドルになる見込みです。' },
      { speaker: 'You', time: '14:05', text: 'ありがとうございます。新予算に合わせてご提案を 1 週間以内にお送りします。' },
      { speaker: 'David Park', time: '14:08', text: '実は Notion AI のプランも検討中です。差別化ポイントを明確にしていただけると助かります。' },
      { speaker: 'Sarah Chen', time: '14:15', text: '8 月末までに契約完了できると嬉しいです。そちらのスケジュールは大丈夫ですか？' },
      { speaker: 'You', time: '14:17', text: '問題ありません。7 月第 2 週にテクニカルデモを設定できると思います。' },
    ],
  },
}

const AVAILABLE_PROPS = [
  { key: 'next_steps', label: 'Next Steps', type: 'textarea' },
  { key: 'close_date', label: 'Close Date', type: 'date' },
  { key: 'deal_stage', label: 'Deal Stage', type: 'enum' },
  { key: 'amount', label: 'Amount', type: 'currency' },
  { key: 'competitor', label: 'Competitor', type: 'text' },
  { key: 'description', label: 'Description / Notes', type: 'textarea' },
  { key: 'lead_source', label: 'Lead Source', type: 'enum' },
  { key: 'probability', label: 'Probability', type: 'number' },
]

export default function MeetingDetail({ lang, isBusinessMeeting, adminConfigured, userHadPersonalConfig }) {
  const T = t[lang]

  return (
    <div className="flex-1 flex min-h-0 min-w-0">
      {/* Left: meeting content */}
      <div className="flex-1 overflow-y-auto p-6 border-r border-gray-800">
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          <div>
            <h1 className="text-lg font-semibold">{MEETING.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>📅 {MEETING.date}</span>
              <span>⏱ {MEETING.duration}</span>
              <span>👥 {MEETING.participants.length} {T.participants}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {MEETING.participants.map(p => (
                <span key={p} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{p}</span>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-violet-400 font-medium mb-2">✨ AI 摘要</p>
            <p className="text-sm text-gray-300 leading-relaxed">{MEETING.summary[lang]}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{T.transcript}</p>
            {MEETING.transcript[lang].map((line, i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-gray-800/50">
                <span className="text-xs text-gray-600 w-10 shrink-0 mt-0.5">{line.time}</span>
                <div className="flex-1">
                  <span className="text-xs text-violet-400 font-medium">{line.speaker}</span>
                  <p className="text-sm text-gray-300 mt-0.5 leading-relaxed">{line.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Brain sidebar */}
      <div className="w-96 shrink-0 flex flex-col min-h-0 bg-gray-950">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-xs font-bold">B</div>
          <span className="text-sm font-medium">Brain</span>
        </div>
        <BrainSidebar
          lang={lang}
          T={T}
          isBusinessMeeting={isBusinessMeeting}
          adminConfigured={adminConfigured}
          userHadPersonalConfig={userHadPersonalConfig}
          context="meeting"
        />
      </div>
    </div>
  )
}

export function BrainSidebar({ lang, T, isBusinessMeeting = true, adminConfigured, userHadPersonalConfig, context = 'meeting' }) {
  if (context === 'meeting' && !isBusinessMeeting) {
    return <GeneralMeetingBrain T={T} />
  }

  return (
    <CrmBrainSidebar
      lang={lang}
      T={T}
      adminConfigured={adminConfigured}
      userHadPersonalConfig={userHadPersonalConfig}
      context={context}
    />
  )
}

function CrmBrainSidebar({ lang, T, adminConfigured, userHadPersonalConfig, context }) {
  const [input, setInput] = useState('')
  const [syncStarted, setSyncStarted] = useState(false)
  const [crm, setCrm] = useState(null)
  const [deal, setDeal] = useState(null)
  const [flow, setFlow] = useState(null)
  const [extraMessages, setExtraMessages] = useState([])
  const [adminTakeoverShown, setAdminTakeoverShown] = useState(false)
  const [userEverConfigured, setUserEverConfigured] = useState(false)
  const [selectedPropKeys, setSelectedPropKeys] = useState(
    AVAILABLE_PROPS.slice(0, 5).map(p => p.key)
  )

  const hasCrmConfig = adminConfigured || userHadPersonalConfig

  function handleSync() {
    if (syncStarted) return
    setSyncStarted(true)
    if (userHadPersonalConfig && adminConfigured && !adminTakeoverShown) {
      setAdminTakeoverShown(true)
      setExtraMessages(m => [...m, { role: 'assistant', text: T.adminTakeoverNotice, isNotice: true }])
      setTimeout(() => setFlow('deal'), 600)
    } else if (userHadPersonalConfig) {
      setFlow('deal')
    } else {
      setFlow('oauth')
    }
  }

  function onOAuthDone(selectedCrm) {
    setCrm(selectedCrm)
    if (!adminConfigured && !userEverConfigured) {
      setFlow('field-select')
    } else {
      setFlow('deal')
    }
  }

  function handleSend() {
    if (!input.trim()) return
    const isSyncIntent = /同期|同步|salesforce|hubspot|crm/i.test(input)
    const hasMeetingReference = /@\S+/.test(input)
    const needsMeetingReference = context === 'standalone' && isSyncIntent && !hasMeetingReference
    const reply = needsMeetingReference
      ? { role: 'assistant', text: T.brainMeetingRequired }
      : isSyncIntent
        ? { role: 'assistant', text: T.aiReplyChat, action: true }
        : { role: 'assistant', text: T.aiReplyGeneric }
    setExtraMessages(m => [...m, { role: 'user', text: input }, reply])
    setInput('')
  }

  const initMessages = context === 'meeting'
    ? [{ role: 'assistant', text: T.aiGreeting }]
    : [
        { role: 'user', text: T.brainCommandExample },
        { role: 'assistant', text: T.aiReplyChat, action: true },
      ]

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">

        {[...initMessages, ...extraMessages].map((m, i) => (
          <SidebarMessage key={i} m={m} T={T} onSync={handleSync} syncStarted={syncStarted} />
        ))}

        {/* Recommended chips */}
        {context === 'meeting' && !syncStarted && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 flex items-center gap-1"><span>💡</span>{T.recommendedActions}</p>
            <button onClick={handleSync}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-violet-500 text-xs px-3 py-2 rounded-xl transition-all text-left w-full">
              <span>🔗</span>
              <span>{hasCrmConfig ? T.recommendSyncChip : T.recommendSyncChipGeneric}</span>
            </button>
            {!adminConfigured && <p className="text-xs text-gray-600">{T.noAdminConfigHint}</p>}
          </div>
        )}

        {flow === 'oauth' && (
          <SidebarCard><OAuthCard onConnect={onOAuthDone} T={T} adminConfigured={adminConfigured} /></SidebarCard>
        )}

        {flow === 'field-select' && (
          <SidebarCard>
            <FieldSelectCard
              T={T}
              selected={selectedPropKeys}
              onToggle={k => setSelectedPropKeys(ks => ks.includes(k) ? ks.filter(x => x !== k) : [...ks, k])}
              onConfirm={() => { setUserEverConfigured(true); setFlow('deal') }}
            />
          </SidebarCard>
        )}

        {flow === 'deal' && (
          <SidebarCard>
            <DealCard crm={crm || 'salesforce'} onSelect={d => { setDeal(d); setFlow('review') }} T={T} lang={lang} />
          </SidebarCard>
        )}

        {flow === 'review' && (
          <SidebarCard>
            <PropertyCard crm={crm || 'salesforce'} deal={deal}
              onSync={() => { setFlow('syncing'); setTimeout(() => setFlow('done'), 2000) }}
              T={T} lang={lang} adminConfigured={adminConfigured} />
          </SidebarCard>
        )}

        {flow === 'syncing' && (
          <SidebarCard>
            <div className="flex items-center gap-2 p-3">
              <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
              <p className="text-xs text-gray-300">{T.syncing}...</p>
            </div>
          </SidebarCard>
        )}

        {flow === 'done' && (
          <SidebarCard><ResultCard crm={crm || 'salesforce'} deal={deal} T={T} /></SidebarCard>
        )}
      </div>

      <div className="p-3 border-t border-gray-800 shrink-0">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={context === 'standalone' ? T.brainCommandExample : T.inputPlaceholder}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-500 transition-colors placeholder-gray-600" />
          <button onClick={handleSend} className="bg-violet-600 hover:bg-violet-500 px-3 py-2 rounded-xl text-xs font-medium transition-colors">{T.sendMessage}</button>
        </div>
      </div>
    </div>
  )
}

function GeneralMeetingBrain({ T }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  function handleSend(text = input) {
    const value = text.trim()
    if (!value) return
    setMessages(current => [
      ...current,
      { role: 'user', text: value },
      { role: 'assistant', text: T.generalMeetingReply },
    ])
    setInput('')
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-5 pb-16">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-lg">✨</div>
            <p className="text-base font-semibold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              {T.generalMeetingGreeting}
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-xs">
              {T.generalMeetingActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-violet-500/60 text-gray-300 text-xs px-3 py-2 rounded-xl transition-all"
                >
                  <span className="mr-1.5">{action.icon}</span>{action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message, index) => (
              <SidebarMessage key={index} m={message} T={T} />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-800 shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={T.inputPlaceholder}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-500 transition-colors placeholder-gray-600"
          />
          <button onClick={() => handleSend()} className="bg-violet-600 hover:bg-violet-500 px-3 py-2 rounded-xl text-xs font-medium transition-colors">
            {T.sendMessage}
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldSelectCard({ T, selected, onToggle, onConfirm }) {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div>
        <p className="text-sm font-medium mb-1">{T.fieldSelectTitle}</p>
        <p className="text-xs text-gray-400 leading-relaxed">{T.noAdminConfigFirstUse}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        {AVAILABLE_PROPS.map(p => (
          <label key={p.key} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" checked={selected.includes(p.key)} onChange={() => onToggle(p.key)} className="accent-violet-500 shrink-0" />
            <span className={`text-sm ${selected.includes(p.key) ? 'text-white' : 'text-gray-500'}`}>{p.label}</span>
            <span className="text-xs text-gray-700 ml-auto">{p.type}</span>
          </label>
        ))}
      </div>
      <button onClick={onConfirm} disabled={selected.length === 0}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium py-2.5 rounded-xl transition-colors">
        {T.fieldSelectConfirm}（{selected.length}）
      </button>
    </div>
  )
}

function SidebarMessage({ m, T, onSync, syncStarted }) {
  return (
    <div className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
      {m.role === 'assistant' && (
        <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">B</div>
      )}
      <div className={`flex flex-col gap-1.5 max-w-[85%] ${m.role === 'user' ? 'items-end' : ''}`}>
        {m.isNotice ? (
          <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-amber-300 leading-relaxed">
            <span className="mr-1">ℹ️</span>{m.text}
          </div>
        ) : (
          <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${m.role === 'user' ? 'bg-violet-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-200 rounded-tl-sm'}`}>
            {m.text}
          </div>
        )}
        {m.action && !syncStarted && (
          <button onClick={onSync} className="self-start bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5">
            <span>🔗</span><span>{T.startSync}</span>
          </button>
        )}
      </div>
    </div>
  )
}

function SidebarCard({ children }) {
  return (
    <div className="flex gap-2">
      <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">B</div>
      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl rounded-tl-sm overflow-hidden">
        {children}
      </div>
    </div>
  )
}
