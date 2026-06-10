import { useLang } from '../LangContext.js'
import { t } from '../i18n.js'

export default function SyncResult({ crm, deal, onReset }) {
  const T = t[useLang()]
  const crmName = crm === 'salesforce' ? 'Salesforce' : 'Hubspot'
  const crmUrl = crm === 'salesforce'
    ? 'https://na1.salesforce.com/opportunity/0061000000AbCdE'
    : 'https://app.hubspot.com/contacts/12345/deal/67890'

  const synced = [
    { label: 'Deal Stage', value: 'Negotiation' },
    { label: 'Close Date', value: '2026-08-31' },
    { label: 'Amount', value: '$120,000' },
    { label: 'Next Steps', value: T.appendedNote },
    { label: 'Competitor', value: 'Notion AI' },
    { label: 'Description / Notes', value: T.appendedNote },
    ...(crm === 'salesforce' ? [{ label: 'Activity', value: `Q3 Business Review — ${T.activityCreated}` }] : []),
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-green-900/40 border-2 border-green-500 flex items-center justify-center text-3xl">✓</div>

        <div className="text-center">
          <p className="text-lg font-semibold">{T.syncDone}</p>
          <p className="text-sm text-gray-400 mt-1">{T.syncedTo} {crmName} · {deal?.name}</p>
        </div>

        <div className="w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {synced.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < synced.length - 1 ? 'border-b border-gray-800' : ''}`}>
              <span className="text-green-500 text-sm">✓</span>
              <span className="text-sm text-gray-300 flex-1">{s.label}</span>
              <span className="text-xs text-gray-500 truncate max-w-[140px]">{s.value}</span>
            </div>
          ))}
        </div>

        <a href={crmUrl} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl py-3 text-sm font-medium transition-colors">
          <span>🔗</span>
          <span>{T.viewInCRM}{T.viewInCRM ? ' ' : ''}{crmName}{T.viewInCRMSuffix}</span>
          <span className="text-gray-500">↗</span>
        </a>

        <button onClick={onReset} className="text-sm text-gray-500 hover:text-white transition-colors">{T.backToBrain}</button>
      </div>
    </div>
  )
}
