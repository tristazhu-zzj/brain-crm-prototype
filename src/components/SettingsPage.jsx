import { useState } from 'react'
import { useLang } from '../LangContext.js'
import { t } from '../i18n.js'

const MOCK_SF_OPP_PROPS = [
  { key: 'next_steps', label: 'Next Steps', type: 'textarea', enabled: true, prompt: '', mode: 'append', isNew: false },
  { key: 'close_date', label: 'Close Date', type: 'date', enabled: true, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'deal_stage', label: 'Stage', type: 'enum', enabled: true, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'amount', label: 'Amount', type: 'currency', enabled: true, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'competitor', label: 'Competitor', type: 'text', enabled: true, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'description', label: 'Description', type: 'textarea', enabled: true, prompt: '请总结客户的核心诉求和本次会议的关键结论。', mode: 'append', isNew: false },
  { key: 'lead_source', label: 'Lead Source', type: 'enum', enabled: false, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'probability', label: 'Probability', type: 'number', enabled: false, prompt: '', mode: 'overwrite', isNew: false },
]

const MOCK_SF_EVENT_PROPS = [
  { key: 'subject', label: 'Subject', type: 'text', enabled: true, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'description', label: 'Description', type: 'textarea', enabled: true, prompt: '请记录会议的主要讨论内容、决策和后续行动。', mode: 'append', isNew: false },
  { key: 'location', label: 'Location', type: 'text', enabled: false, prompt: '', mode: 'overwrite', isNew: false },
]

const MOCK_HS_DEAL_PROPS = [
  { key: 'closedate', label: 'Close Date', type: 'date', enabled: true, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'dealstage', label: 'Deal Stage', type: 'enum', enabled: true, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'amount', label: 'Amount', type: 'number', enabled: true, prompt: '', mode: 'overwrite', isNew: false },
  { key: 'hs_next_step', label: 'Next Steps', type: 'textarea', enabled: true, prompt: '', mode: 'append', isNew: false },
  { key: 'description', label: 'Description', type: 'textarea', enabled: true, prompt: '', mode: 'append', isNew: false },
]

// Simulated new fields from CRM refresh
const NEW_SF_PROPS = [
  { key: 'budget_range', label: 'Budget Range', type: 'enum', enabled: false, prompt: '', mode: 'overwrite', isNew: true },
  { key: 'use_case', label: 'Use Case', type: 'text', enabled: false, prompt: '', mode: 'overwrite', isNew: true },
]

export default function SettingsPage() {
  const lang = useLang()
  const T = t[lang]
  const [activeTab, setActiveTab] = useState('salesforce')
  const [sfEventEnabled, setSfEventEnabled] = useState(false)
  const [sfOppProps, setSfOppProps] = useState(MOCK_SF_OPP_PROPS)
  const [sfEventProps, setSfEventProps] = useState(MOCK_SF_EVENT_PROPS)
  const [hsProps, setHsProps] = useState(MOCK_HS_DEAL_PROPS)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshed, setRefreshed] = useState(false)

  function updateProp(setter, key, field, val) {
    setter(ps => ps.map(p => p.key === key ? { ...p, [field]: val } : p))
  }

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => {
      setSfOppProps(ps => {
        const existingKeys = ps.map(p => p.key)
        const toAdd = NEW_SF_PROPS.filter(p => !existingKeys.includes(p.key))
        return toAdd.length > 0 ? [...ps, ...toAdd] : ps
      })
      setRefreshing(false)
      setRefreshed(true)
      setTimeout(() => setRefreshed(false), 3000)
    }, 1200)
  }

  const currentProps = activeTab === 'salesforce' ? sfOppProps : hsProps
  const setter = activeTab === 'salesforce' ? setSfOppProps : setHsProps

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <div>
          <h1 className="text-base font-semibold">{T.settings}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{T.settingsDesc}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* CRM connection */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-300">{T.crmConnection}</p>
            {[
              { id: 'salesforce', name: 'Salesforce', logo: '☁️', connected: true },
              { id: 'hubspot', name: 'Hubspot', logo: '🟠', connected: false },
            ].map(crm => (
              <div key={crm.id} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <span className="text-xl">{crm.logo}</span>
                <span className="text-sm font-medium flex-1">{crm.name}</span>
                {crm.connected
                  ? <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">{T.connected}</span>
                  : <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">{T.connectCRM}</button>
                }
              </div>
            ))}
          </div>

          {/* Property config */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-300">{T.propertySyncConfig}</p>
              <button onClick={handleRefresh} disabled={refreshing}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                {refreshing
                  ? <><span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />{T.refreshing}</>
                  : refreshed
                  ? <><span className="text-green-400">✓</span>{T.refreshDone}</>
                  : <><span>🔄</span>{T.refreshFields}</>
                }
              </button>
            </div>

            <div className="flex gap-1 bg-gray-800 p-1 rounded-lg self-start">
              {[{ id: 'salesforce', label: 'Salesforce' }, { id: 'hubspot', label: 'Hubspot' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === tab.id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'salesforce' && (
              <div className="flex flex-col gap-4">
                <PropSection title={`Opportunity ${T.propertyList}`} props={sfOppProps}
                  onUpdate={(key, field, val) => updateProp(setSfOppProps, key, field, val)} T={T} />
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 flex items-center gap-2">
                    <span className="text-sm">📆</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{T.syncEvent}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{T.syncEventDesc}</p>
                    </div>
                    <Toggle value={sfEventEnabled} onChange={setSfEventEnabled} />
                  </div>
                  {sfEventEnabled && (
                    <div className="border-t border-gray-800 p-4">
                      <PropSection title={`Event ${T.propertyList}`} props={sfEventProps}
                        onUpdate={(key, field, val) => updateProp(setSfEventProps, key, field, val)} T={T} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'hubspot' && (
              <PropSection title={`Deal ${T.propertyList}`} props={hsProps}
                onUpdate={(key, field, val) => updateProp(setHsProps, key, field, val)} T={T} />
            )}
          </div>

          <button className="self-start bg-violet-600 hover:bg-violet-500 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            {T.saveSettings}
          </button>
        </div>
      </div>
    </div>
  )
}

function PropSection({ title, props, onUpdate, T }) {
  const canToggleMode = (type) => type === 'text' || type === 'textarea'
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
      {props.map(p => (
        <div key={p.key} className={`bg-gray-900 border rounded-xl overflow-hidden transition-colors ${p.isNew ? 'border-amber-600/50' : p.enabled ? 'border-gray-700' : 'border-gray-800'}`}>
          {/* Row header */}
          <div className="px-4 py-3 flex items-center gap-3">
            <input type="checkbox" checked={p.enabled} onChange={() => onUpdate(p.key, 'enabled', !p.enabled)} className="accent-violet-500 w-4 h-4 shrink-0" />
            <span className={`text-sm flex-1 ${p.enabled ? 'text-white' : 'text-gray-500'}`}>{p.label}</span>
            {p.isNew && <span className="text-xs bg-amber-900/50 text-amber-400 px-1.5 py-0.5 rounded-full shrink-0">NEW</span>}
            <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded shrink-0">{p.type}</span>
            {/* Append / Overwrite toggle — only for text types */}
            {p.enabled && canToggleMode(p.type) && (
              <button onClick={() => onUpdate(p.key, 'mode', p.mode === 'append' ? 'overwrite' : 'append')}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors shrink-0 ${p.mode === 'append' ? 'border-blue-600 text-blue-400 bg-blue-900/20' : 'border-gray-700 text-gray-500 hover:text-gray-300'}`}>
                {p.mode === 'append' ? T.append : T.overwrite}
              </button>
            )}
          </div>
          {/* Prompt — always visible when enabled */}
          {p.enabled && (
            <div className="px-4 pb-3">
              <textarea value={p.prompt} onChange={e => onUpdate(p.key, 'prompt', e.target.value)}
                placeholder={T.promptPlaceholder} rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 transition-colors resize-none placeholder-gray-600" />
              <p className="text-xs text-gray-600 mt-1">{T.promptHint}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-violet-600' : 'bg-gray-700'}`}>
      <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" style={{ left: value ? '22px' : '2px' }} />
    </button>
  )
}
