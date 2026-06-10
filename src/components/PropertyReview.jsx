import { useState } from 'react'
import { useLang } from '../LangContext.js'
import { t } from '../i18n.js'
import { StepHeader } from './DealMatch.jsx'

const INITIAL_PROPERTIES = [
  { key: 'next_steps', label: 'Next Steps', type: 'textarea', current: '', generated: { zh: '安排技术演示（由 David Park 协调），目标在 7 月第二周完成。Sarah 确认 8 月底前签约。', ja: 'テクニカルデモを設定（David Park が調整）、7 月第 2 週完了予定。Sarah は 8 月末までに契約完了を確認。' }, mode: 'append', included: true },
  { key: 'close_date', label: 'Close Date', type: 'date', current: '2026-09-30', generated: { zh: '2026-08-31', ja: '2026-08-31' }, mode: 'overwrite', included: true },
  { key: 'deal_stage', label: 'Deal Stage', type: 'enum', options: ['Prospecting', 'Qualification', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'], current: 'Proposal Sent', generated: { zh: 'Negotiation', ja: 'Negotiation' }, mode: 'overwrite', included: true },
  { key: 'amount', label: 'Amount', type: 'currency', current: '$100,000', generated: { zh: '$120,000', ja: '$120,000' }, mode: 'overwrite', included: true },
  { key: 'competitor', label: 'Competitor', type: 'text', current: '', generated: { zh: 'Notion AI', ja: 'Notion AI' }, mode: 'overwrite', included: true },
  { key: 'description', label: 'Description / Notes', type: 'textarea', current: 'Initial contact made in April 2026.', generated: { zh: '2026-06-10 会议：讨论 Q3 续约，预算从 $100K 提升至 $120K，竞品提及 Notion AI，客户倾向续约。', ja: '2026-06-10 ミーティング：Q3 更新、予算 $100K→$120K、競合 Notion AI 言及、顧客は更新傾向。' }, mode: 'append', included: true },
]

const LINKED_ACTIVITIES = [
  { id: 'a1', title: 'Q2 Check-in Call', date: '2026-05-15', type: 'Call', desc: { zh: '季度进展确认，预算审批中。', ja: '四半期進捗確認、予算承認中。' } },
  { id: 'a2', title: 'Renewal Discussion', date: '2026-06-01', type: 'Meeting', desc: { zh: '初步讨论续约条款。', ja: '更新条件の初期協議。' } },
]

const ALL_ACTIVITIES = [
  { id: 'b1', title: 'Follow-up Call — Acme', date: '2026-06-08', type: 'Call', desc: { zh: '跟进上次演示反馈。', ja: '前回デモのフォローアップ。' } },
  { id: 'b2', title: 'Proposal Review Meeting', date: '2026-06-03', type: 'Meeting', desc: { zh: '审阅合同草稿。', ja: '契約書草案のレビュー。' } },
  { id: 'b3', title: 'Intro Email — Sarah Chen', date: '2026-05-20', type: 'Email', desc: { zh: '初次接触邮件。', ja: '初回コンタクトメール。' } },
]

const AI_GENERATED_ACTIVITY = {
  title: 'Q3 Business Review — Acme Corp',
  date: '2026-06-10',
  type: 'Meeting',
  description: { zh: '与 Sarah Chen、David Park 会议。议题：Q3 续约（$120K）、技术演示安排、竞品对比。结果：客户倾向续约，下步安排技术演示。', ja: 'Sarah Chen・David Park とのミーティング。議題：Q3 更新（$120K）、テクニカルデモ設定、競合比較。結果：顧客は更新傾向、次ステップはデモ設定。' },
}

const NEW_PROPERTIES = [
  { key: 'budget_range', label: 'Budget Range', type: 'enum', options: ['< $50K', '$50K–$100K', '$100K–$200K', '> $200K'] },
  { key: 'use_case', label: 'Use Case', type: 'text' },
]

export default function PropertyReview({ crm, deal, onSync, onBack }) {
  const lang = useLang()
  const T = t[lang]
  const isSalesforce = crm === 'salesforce'

  const [properties, setProperties] = useState(
    INITIAL_PROPERTIES.map(p => ({ ...p, generatedVal: p.generated[lang] }))
  )
  const [activityEnabled, setActivityEnabled] = useState(isSalesforce)
  const [newActivity, setNewActivity] = useState({ ...AI_GENERATED_ACTIVITY, description: AI_GENERATED_ACTIVITY.description[lang] })
  const [hasLinkedActivities, setHasLinkedActivities] = useState(true)
  const [showManage, setShowManage] = useState(false)
  const [newPropAlert, setNewPropAlert] = useState(true)
  const [addedNew, setAddedNew] = useState([])

  function updateProp(key, field, value) {
    setProperties(ps => ps.map(p => p.key === key ? { ...p, [field]: value } : p))
  }

  function addNewProp(np) {
    setProperties(ps => [...ps, { ...np, current: '', generatedVal: '', mode: 'overwrite', included: true }])
    setAddedNew(a => [...a, np.key])
    setNewPropAlert(false)
  }

  const included = properties.filter(p => p.included)
  const crmLabel = isSalesforce ? 'Salesforce' : 'Hubspot'

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <StepHeader step={3} total={4} crm={crmLabel} onBack={onBack} title={T.stepReview} T={T} />

      {newPropAlert && (
        <div className="mx-4 mt-3 bg-amber-900/30 border border-amber-700/50 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-amber-400">✨</span>
          <p className="text-sm text-amber-300 flex-1">{T.newFieldAlert} <strong>Budget Range</strong>、<strong>Use Case</strong></p>
          <button onClick={() => NEW_PROPERTIES.forEach(addNewProp)} className="text-xs bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-colors font-medium shrink-0">{T.addFields}</button>
          <button onClick={() => setNewPropAlert(false)} className="text-xs text-gray-500 hover:text-white transition-colors shrink-0">{T.ignore}</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-3">

          <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-lg">🏢</span>
            <div>
              <p className="text-sm font-medium">{deal?.name}</p>
              <p className="text-xs text-gray-500">{deal?.stage} · {deal?.amount}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{T.fieldCount} ({included.length})</p>
            <button onClick={() => setShowManage(m => !m)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">{T.manageFields}</button>
          </div>

          {showManage && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-400 mb-1">{T.selectFields}</p>
              {properties.map(p => (
                <label key={p.key} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" checked={p.included} onChange={e => updateProp(p.key, 'included', e.target.checked)} className="accent-violet-500" />
                  <span className={p.included ? 'text-white' : 'text-gray-500'}>{p.label}</span>
                  <span className="text-xs text-gray-600">{p.type}</span>
                </label>
              ))}
            </div>
          )}

          {included.map(p => (
            <PropertyRow key={p.key} prop={p} T={T} onChange={(f, v) => updateProp(p.key, f, v)} isNew={addedNew.includes(p.key)} />
          ))}

          {isSalesforce && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-800">
                <span className="text-sm">📆</span>
                <p className="text-sm font-medium flex-1">{T.syncActivity}</p>
                <Toggle value={activityEnabled} onChange={setActivityEnabled} />
              </div>
              {activityEnabled && (
                <div className="p-4">
                  <ActivityPanel
                    hasLinked={hasLinkedActivities}
                    linkedActivities={LINKED_ACTIVITIES}
                    newActivity={newActivity}
                    onNewActivityChange={v => setNewActivity(a => ({...a, ...v}))}
                    dealName={deal?.name}
                    T={T} lang={lang}
                  />
                </div>
              )}
            </div>
          )}
          {isSalesforce && (
            <button onClick={() => setHasLinkedActivities(v => !v)} className="text-xs text-gray-700 hover:text-gray-500 transition-colors self-start">
              [Demo] {T.demoSwitchTo(hasLinkedActivities)}
            </button>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="max-w-2xl mx-auto flex gap-2">
          <button onClick={onBack} className="border border-gray-700 hover:bg-gray-800 px-5 py-3 rounded-xl text-sm transition-colors text-gray-400">{T.back}</button>
          <button onClick={onSync} className="flex-1 bg-violet-600 hover:bg-violet-500 py-3 rounded-xl font-medium transition-colors">
            {T.syncBtn(included.length, crmLabel)}
          </button>
        </div>
      </div>
    </div>
  )
}

function PropertyRow({ prop, T, onChange, isNew }) {
  const [editing, setEditing] = useState(false)
  const canToggleMode = prop.type === 'text' || prop.type === 'textarea'
  const val = prop.generatedVal ?? prop.generated

  return (
    <div className={`bg-gray-900 border rounded-xl overflow-hidden ${isNew ? 'border-amber-600/50' : 'border-gray-800'}`}>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">{prop.label}</span>
          {isNew && <span className="text-xs bg-amber-900/50 text-amber-400 px-1.5 py-0.5 rounded-full">NEW</span>}
          <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">{prop.type}</span>
          <div className="ml-auto">
            {canToggleMode ? (
              <button onClick={() => onChange('mode', prop.mode === 'append' ? 'overwrite' : 'append')}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${prop.mode === 'append' ? 'border-blue-600 text-blue-400 bg-blue-900/20' : 'border-gray-700 text-gray-500 hover:text-gray-300'}`}>
                {prop.mode === 'append' ? T.append : T.overwrite}
              </button>
            ) : (
              <span className="text-xs text-gray-700 px-2 py-0.5 rounded-full border border-gray-800">{T.overwrite}</span>
            )}
          </div>
        </div>
        {prop.current && (
          <div className="flex items-start gap-2 mb-2">
            <span className="text-xs text-gray-600 mt-0.5 shrink-0">{T.originalValue}</span>
            <p className="text-xs text-gray-500 line-through">{prop.current}</p>
          </div>
        )}
        <div className="flex items-start gap-2">
          <span className="text-xs text-violet-400 mt-0.5 shrink-0">→</span>
          {editing ? (
            prop.type === 'textarea' ? (
              <textarea value={val} onChange={e => onChange('generatedVal', e.target.value)}
                onBlur={() => setEditing(false)} autoFocus rows={3}
                className="flex-1 bg-gray-800 border border-violet-500 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
            ) : prop.type === 'enum' ? (
              <select value={val} onChange={e => { onChange('generatedVal', e.target.value); setEditing(false) }}
                autoFocus onBlur={() => setEditing(false)}
                className="flex-1 bg-gray-800 border border-violet-500 rounded-lg px-3 py-2 text-sm outline-none">
                {prop.options.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input value={val} onChange={e => onChange('generatedVal', e.target.value)}
                onBlur={() => setEditing(false)} autoFocus
                className="flex-1 bg-gray-800 border border-violet-500 rounded-lg px-3 py-2 text-sm outline-none" />
            )
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex-1 text-left text-sm text-white hover:bg-gray-800 rounded-lg px-3 py-1.5 transition-colors group">
              {val || <span className="text-gray-600 italic">{T.clickToEdit}</span>}
              <span className="text-gray-600 text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`w-10 h-6 rounded-full transition-colors relative ${value ? 'bg-violet-600' : 'bg-gray-700'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${value ? 'left-5' : 'left-1'}`} />
    </button>
  )
}

function ActivityPanel({ hasLinked, linkedActivities, newActivity, onNewActivityChange, dealName, T, lang }) {
  const [selectedId, setSelectedId] = useState(hasLinked ? linkedActivities[0]?.id : null)
  const [extra, setExtra] = useState('none')
  const [searchQ, setSearchQ] = useState('')
  const TYPES = ['Call', 'Meeting', 'Email', 'Task']

  const filtered = ALL_ACTIVITIES.filter(a =>
    a.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQ.toLowerCase())
  )

  function selectActivity(id) { setSelectedId(id); setExtra('none') }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 mb-1">
        {hasLinked ? T.hasLinkedDesc(linkedActivities.length) : T.noLinkedDesc}
      </p>

      {hasLinked && linkedActivities.map(a => (
        <button key={a.id} onClick={() => selectActivity(a.id)}
          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selectedId === a.id && extra === 'none' ? 'border-violet-500 bg-violet-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedId === a.id && extra === 'none' ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
              {selectedId === a.id && extra === 'none' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{a.title}</span>
                <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{a.type}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{a.date} · {a.desc[lang]}</p>
            </div>
          </div>
        </button>
      ))}

      <div className="flex gap-2 mt-1">
        <button onClick={() => setExtra(extra === 'search' ? 'none' : 'search')}
          className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${extra === 'search' ? 'border-violet-500 text-violet-400 bg-violet-900/20' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}>
          {T.searchOther}
        </button>
        <button onClick={() => setExtra(extra === 'create' ? 'none' : 'create')}
          className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${extra === 'create' ? 'border-violet-500 text-violet-400 bg-violet-900/20' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}>
          {T.createNew}
        </button>
      </div>

      {extra === 'search' && (
        <div className="flex flex-col gap-2 mt-1">
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder={T.searchPlaceholder}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors placeholder-gray-600" />
          {filtered.map(a => (
            <button key={a.id} onClick={() => selectActivity(a.id)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selectedId === a.id ? 'border-violet-500 bg-violet-900/20' : 'border-gray-700 hover:border-gray-600'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedId === a.id ? 'border-violet-400 bg-violet-500' : 'border-gray-600'}`}>
                  {selectedId === a.id && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{a.title}</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{a.type}</span>
                    <span className="text-xs text-gray-600">{a.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{a.desc[lang]}</p>
                </div>
              </div>
            </button>
          ))}
          {selectedId && (
            <p className="text-xs text-violet-300 bg-violet-900/20 border border-violet-700/50 rounded-xl px-4 py-2.5">
              {T.willLinkTo}<span className="font-medium">{dealName}</span>
            </p>
          )}
        </div>
      )}

      {extra === 'create' && (
        <div className="flex flex-col gap-3 mt-1">
          <span className="text-xs text-violet-400 bg-violet-900/30 px-2 py-0.5 rounded-full self-start">{T.aiPrefilled}</span>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">{T.activityTitle}</label>
              <input value={newActivity.title} onChange={e => onNewActivityChange({ title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{T.activityType}</label>
              <select value={newActivity.type} onChange={e => onNewActivityChange({ type: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{T.activityDate}</label>
              <input type="date" value={newActivity.date} onChange={e => onNewActivityChange({ date: e.target.value })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">{T.activityDesc}</label>
            <textarea value={newActivity.description} onChange={e => onNewActivityChange({ description: e.target.value })} rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors resize-none" />
          </div>
          <p className="text-xs text-gray-600">{T.autoLink(dealName)}</p>
        </div>
      )}
    </div>
  )
}
