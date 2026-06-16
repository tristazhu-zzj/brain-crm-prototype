import { useState } from 'react'

const INITIAL_PROPERTIES = [
  { key: 'next_steps', label: 'Next Steps', type: 'textarea', current: '', generated: { zh: '安排技术演示（由 David Park 协调），目标在 7 月第二周完成。Sarah 确认 8 月底前签约。', ja: 'テクニカルデモを設定（David Park が調整）、7 月第 2 週完了予定。Sarah は 8 月末までに契約完了を確認。' }, mode: 'append', included: true },
  { key: 'close_date', label: 'Close Date', type: 'date', current: '2026-09-30', generated: { zh: '2026-08-31', ja: '2026-08-31' }, mode: 'overwrite', included: true },
  { key: 'deal_stage', label: 'Deal Stage', type: 'enum', options: ['Prospecting', 'Qualification', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'], current: 'Proposal Sent', generated: { zh: 'Negotiation', ja: 'Negotiation' }, mode: 'overwrite', included: true },
  { key: 'amount', label: 'Amount', type: 'currency', current: '$100,000', generated: { zh: '$120,000', ja: '$120,000' }, mode: 'overwrite', included: true },
  { key: 'competitor', label: 'Competitor', type: 'text', current: '', generated: { zh: 'Notion AI', ja: 'Notion AI' }, mode: 'overwrite', included: true },
  { key: 'description', label: 'Description / Notes', type: 'textarea', current: 'Initial contact made in April 2026.', generated: { zh: '2026-06-10 会议：讨论 Q3 续约，预算从 $100K 提升至 $120K，竞品提及 Notion AI，客户倾向续约。', ja: '2026-06-10 ミーティング：Q3 更新、予算 $100K→$120K、競合 Notion AI 言及、顧客は更新傾向。' }, mode: 'append', included: true },
]

const LINKED_EVENTS = [
  { id: 'a1', title: 'Q2 Check-in Call', date: '2026-05-15', type: 'Call', desc: { zh: '季度进展确认，预算审批中。', ja: '四半期進捗確認、予算承認中。' } },
  { id: 'a2', title: 'Renewal Discussion', date: '2026-06-01', type: 'Meeting', desc: { zh: '初步讨论续约条款。', ja: '更新条件の初期協議。' } },
]

const ALL_EVENTS = [
  { id: 'b1', title: 'Follow-up Call — Acme', date: '2026-06-08', type: 'Call', desc: { zh: '跟进上次演示反馈。', ja: '前回デモのフォローアップ。' } },
  { id: 'b2', title: 'Proposal Review Meeting', date: '2026-06-03', type: 'Meeting', desc: { zh: '审阅合同草稿。', ja: '契約書草案のレビュー。' } },
  { id: 'b3', title: 'Intro Email — Sarah Chen', date: '2026-05-20', type: 'Email', desc: { zh: '初次接触邮件。', ja: '初回コンタクトメール。' } },
]

const AI_EVENT = {
  title: 'Q3 Business Review — Acme Corp',
  date: '2026-06-10', type: 'Meeting',
  description: { zh: '与 Sarah Chen、David Park 会议。议题：Q3 续约（$120K）、技术演示安排、竞品对比。结果：客户倾向续约，下步安排技术演示。', ja: 'Sarah Chen・David Park とのミーティング。議題：Q3 更新（$120K）、テクニカルデモ設定、競合比較。結果：顧客は更新傾向、次ステップはデモ設定。' },
}

const AI_TASKS = [
  { id: 1, title: { zh: '安排技术演示', ja: 'テクニカルデモを設定' }, due: '2026-07-10' },
  { id: 2, title: { zh: '发送合同草稿', ja: '契約書草案を送付' }, due: '2026-07-05' },
  { id: 3, title: { zh: '确认预算审批', ja: '予算承認を確認' }, due: '' },
]

const NEW_PROPERTIES = []

export default function PropertyCard({ crm, deal, onSync, T, lang, adminConfigured }) {
  const isSalesforce = crm === 'salesforce'
  const [properties, setProperties] = useState(INITIAL_PROPERTIES.map(p => ({ ...p, generatedVal: p.generated[lang] })))
  const [eventEnabled, setEventEnabled] = useState(isSalesforce)
  const [newEvent, setNewEvent] = useState({ ...AI_EVENT, description: AI_EVENT.description[lang] })
  const [hasLinked, setHasLinked] = useState(true)
  const [tasks, setTasks] = useState(AI_TASKS.map(tk => ({ ...tk, title: tk.title[lang], checked: true })))
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [addingTask, setAddingTask] = useState(false)

  const included = properties.filter(p => p.included)

  function updateProp(key, field, value) {
    setProperties(ps => ps.map(p => p.key === key ? { ...p, [field]: value } : p))
  }

  function addTask() {
    if (!newTaskTitle.trim()) return
    setTasks(ts => [...ts, { id: Date.now(), title: newTaskTitle, due: '', checked: true }])
    setNewTaskTitle('')
    setAddingTask(false)
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Deal info */}
      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800 rounded-lg px-3 py-2">
        <span>🏢</span>
        <span className="font-medium text-gray-200">{deal?.name}</span>
        <span className="text-gray-600">·</span>
        <span>{deal?.stage}</span>
        <span className="text-gray-600">·</span>
        <span>{deal?.amount}</span>
      </div>

      {/* First-time hint when no admin config */}
      {!adminConfigured && (
        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl px-3 py-2.5 flex items-start gap-2">
          <span className="text-blue-400 text-sm shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs text-blue-300 leading-relaxed">{T.noAdminConfigFirstUse}</p>
        </div>
      )}

      {/* Field count */}
      <p className="text-xs text-gray-500 uppercase tracking-wide">{T.fieldCount} ({included.length})</p>

      {/* Properties */}
      {included.map(p => <PropRow key={p.key} prop={p} T={T} onChange={(f, v) => updateProp(p.key, f, v)} />)}

      {/* Task section */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="px-3 py-2.5 border-b border-gray-700 flex items-center gap-2">
          <span className="text-sm">✅</span>
          <p className="text-sm font-medium flex-1">{T.taskSection}</p>
          <span className="text-xs text-gray-500">{T.taskFrom}</span>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {tasks.map(tk => (
            <div key={tk.id} className="flex items-center gap-2">
              <input type="checkbox" checked={tk.checked} onChange={() => setTasks(ts => ts.map(t => t.id === tk.id ? { ...t, checked: !t.checked } : t))}
                className="accent-violet-500 shrink-0" />
              <input value={tk.title} onChange={e => setTasks(ts => ts.map(t => t.id === tk.id ? { ...t, title: e.target.value } : t))}
                className={`flex-1 bg-transparent text-sm outline-none border-b border-transparent focus:border-gray-600 transition-colors ${!tk.checked ? 'line-through text-gray-500' : 'text-white'}`} />
              <input type="date" value={tk.due} onChange={e => setTasks(ts => ts.map(t => t.id === tk.id ? { ...t, due: e.target.value } : t))}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-0.5 text-xs outline-none text-gray-400 w-32" />
              <button onClick={() => setTasks(ts => ts.filter(t => t.id !== tk.id))} className="text-gray-600 hover:text-red-400 transition-colors text-xs">✕</button>
            </div>
          ))}
          {addingTask ? (
            <div className="flex items-center gap-2 mt-1">
              <input autoFocus value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setAddingTask(false) }}
                placeholder={T.taskPlaceholder}
                className="flex-1 bg-gray-700 border border-violet-500 rounded-lg px-3 py-1.5 text-sm outline-none placeholder-gray-600" />
              <button onClick={addTask} className="text-xs bg-violet-600 hover:bg-violet-500 px-2 py-1.5 rounded-lg transition-colors">+</button>
              <button onClick={() => setAddingTask(false)} className="text-xs text-gray-500 hover:text-white transition-colors">✕</button>
            </div>
          ) : (
            <button onClick={() => setAddingTask(true)} className="text-xs text-gray-500 hover:text-violet-400 transition-colors self-start mt-1">
              {T.taskAddManual}
            </button>
          )}
        </div>
      </div>

      {/* Event (Salesforce only) */}
      {isSalesforce && (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="px-3 py-2.5 flex items-center gap-2 border-b border-gray-700">
            <span className="text-sm">📆</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{T.syncEvent}</p>
              <p className="text-xs text-gray-500">{T.syncEventDesc}</p>
            </div>
            <Toggle value={eventEnabled} onChange={setEventEnabled} />
          </div>
          {eventEnabled && (
            <div className="p-3">
              <EventPanel hasLinked={hasLinked} linkedEvents={LINKED_EVENTS}
                newEvent={newEvent} onNewEventChange={v => setNewEvent(a => ({...a, ...v}))}
                dealName={deal?.name} T={T} lang={lang} />
            </div>
          )}
        </div>
      )}
      {isSalesforce && (
        <button onClick={() => setHasLinked(v => !v)} className="text-xs text-gray-700 hover:text-gray-500 transition-colors self-start">
          [Demo] {T.demoSwitchTo(hasLinked)}
        </button>
      )}

      <button onClick={onSync} className="w-full bg-violet-600 hover:bg-violet-500 py-2.5 rounded-xl text-sm font-medium transition-colors mt-1">
        {T.syncBtn(included.length, crm === 'salesforce' ? 'Salesforce' : 'Hubspot')}
      </button>
    </div>
  )
}

function PropRow({ prop, T, isNew, onChange }) {
  const [editing, setEditing] = useState(false)
  const canToggle = prop.type === 'text' || prop.type === 'textarea'
  const val = prop.generatedVal ?? ''

  return (
    <div className={`bg-gray-800 border rounded-xl overflow-hidden ${isNew ? 'border-amber-600/50' : 'border-gray-700'}`}>
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-medium">{prop.label}</span>
          <span className="text-xs text-gray-600 bg-gray-700 px-1.5 py-0.5 rounded">{prop.type}</span>
          <div className="ml-auto">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${canToggle && prop.mode === 'append' ? 'border-blue-800 text-blue-500' : 'border-gray-700 text-gray-600'}`}>
              {canToggle && prop.mode === 'append' ? T.append : T.overwrite}
            </span>
          </div>
        </div>
        {prop.current && (
          <div className="flex gap-2 mb-1">
            <span className="text-xs text-gray-600 shrink-0">{T.originalValue}</span>
            <p className="text-xs text-gray-500 line-through">{prop.current}</p>
          </div>
        )}
        <div className="flex items-start gap-2">
          <span className="text-xs text-violet-400 mt-0.5 shrink-0">→</span>
          {editing ? (
            prop.type === 'textarea' ? (
              <textarea value={val} onChange={e => onChange('generatedVal', e.target.value)} onBlur={() => setEditing(false)} autoFocus rows={2}
                className="flex-1 bg-gray-700 border border-violet-500 rounded-lg px-2 py-1.5 text-sm outline-none resize-none" />
            ) : prop.type === 'enum' ? (
              <select value={val} onChange={e => { onChange('generatedVal', e.target.value); setEditing(false) }} autoFocus onBlur={() => setEditing(false)}
                className="flex-1 bg-gray-700 border border-violet-500 rounded-lg px-2 py-1.5 text-sm outline-none">
                {prop.options.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input value={val} onChange={e => onChange('generatedVal', e.target.value)} onBlur={() => setEditing(false)} autoFocus
                className="flex-1 bg-gray-700 border border-violet-500 rounded-lg px-2 py-1.5 text-sm outline-none" />
            )
          ) : (
            <button onClick={() => setEditing(true)} className="flex-1 text-left text-sm text-white hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors group">
              {val || <span className="text-gray-600 italic">{T.clickToEdit}</span>}
              <span className="text-gray-600 text-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${value ? 'bg-violet-600' : 'bg-gray-600'}`}>
      <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all" style={{ left: value ? '18px' : '2px' }} />
    </button>
  )
}

function EventPanel({ hasLinked, linkedEvents, newEvent, onNewEventChange, dealName, T, lang }) {
  const [selectedId, setSelectedId] = useState(hasLinked ? linkedEvents[0]?.id : null)
  const [extra, setExtra] = useState('none')
  const [searchQ, setSearchQ] = useState('')
  const TYPES = ['Call', 'Meeting', 'Email', 'Task']

  const filtered = ALL_EVENTS.filter(a =>
    a.title.toLowerCase().includes(searchQ.toLowerCase()) || a.type.toLowerCase().includes(searchQ.toLowerCase())
  )

  function selectEvent(id) { setSelectedId(id); setExtra('none') }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400">{hasLinked ? T.hasLinkedDesc(linkedEvents.length) : T.noLinkedDesc}</p>

      {hasLinked && linkedEvents.map(a => (
        <button key={a.id} onClick={() => selectEvent(a.id)}
          className={`w-full text-left p-2.5 rounded-xl border-2 transition-all ${selectedId === a.id && extra === 'none' ? 'border-violet-500 bg-violet-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
          <div className="flex items-start gap-2">
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedId === a.id && extra === 'none' ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
              {selectedId === a.id && extra === 'none' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{a.title}</span>
                <span className="text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">{a.type}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{a.date} · {a.desc[lang]}</p>
            </div>
          </div>
        </button>
      ))}

      <div className="flex gap-2">
        <button onClick={() => setExtra(extra === 'search' ? 'none' : 'search')}
          className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${extra === 'search' ? 'border-violet-500 text-violet-400 bg-violet-900/20' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}>
          {T.searchOther}
        </button>
        <button onClick={() => setExtra(extra === 'create' ? 'none' : 'create')}
          className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${extra === 'create' ? 'border-violet-500 text-violet-400 bg-violet-900/20' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}>
          {T.createNew}
        </button>
      </div>

      {extra === 'search' && (
        <div className="flex flex-col gap-2">
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={T.searchPlaceholder}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-500" />
          {filtered.map(a => (
            <button key={a.id} onClick={() => selectEvent(a.id)}
              className={`w-full text-left p-2.5 rounded-xl border-2 transition-all ${selectedId === a.id ? 'border-violet-500 bg-violet-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
              <div className="flex items-start gap-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedId === a.id ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
                  {selectedId === a.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{a.title}</span>
                    <span className="text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">{a.type}</span>
                    <span className="text-xs text-gray-600">{a.date}</span>
                  </div>
                  <p className="text-xs text-gray-500">{a.desc[lang]}</p>
                </div>
              </div>
            </button>
          ))}
          {selectedId && extra === 'search' && (
            <p className="text-xs text-violet-300 bg-violet-900/20 border border-violet-700/50 rounded-lg px-3 py-2">
              {T.willLinkTo}<span className="font-medium">{dealName}</span>
            </p>
          )}
        </div>
      )}

      {extra === 'create' && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-violet-400 bg-violet-900/30 px-2 py-0.5 rounded-full self-start">{T.aiPrefilled}</span>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">{T.activityTitle}</label>
              <input value={newEvent.title} onChange={e => onNewEventChange({ title: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-violet-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{T.activityType}</label>
              <select value={newEvent.type} onChange={e => onNewEventChange({ type: e.target.value })}
                className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-violet-500 transition-colors">
                {TYPES.map(tp => <option key={tp}>{tp}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{T.activityDate}</label>
              <input type="date" value={newEvent.date} onChange={e => onNewEventChange({ date: e.target.value })}
                className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-violet-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">{T.activityDesc}</label>
            <textarea value={newEvent.description} onChange={e => onNewEventChange({ description: e.target.value })} rows={2}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-violet-500 transition-colors resize-none" />
          </div>
          <p className="text-xs text-gray-600">{T.autoLink(dealName)}</p>
        </div>
      )}
    </div>
  )
}
