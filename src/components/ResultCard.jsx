export default function ResultCard({ crm, deal, T }) {
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
    { label: 'Description', value: T.appendedNote },
    ...(crm === 'salesforce' ? [{ label: 'Activity', value: T.activityCreated }] : []),
  ]

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-green-400 text-lg">✓</span>
        <p className="text-sm font-medium">{T.syncDone}</p>
      </div>
      <p className="text-xs text-gray-400">{T.syncedTo} {crmName} · {deal?.name}</p>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {synced.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 px-3 py-2 ${i < synced.length - 1 ? 'border-b border-gray-700' : ''}`}>
            <span className="text-green-500 text-xs">✓</span>
            <span className="text-xs text-gray-300 flex-1">{s.label}</span>
            <span className="text-xs text-gray-500">{s.value}</span>
          </div>
        ))}
      </div>

      <a href={crmUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl py-2.5 text-sm transition-colors">
        <span>🔗</span>
        <span>{T.viewInCRM}{T.viewInCRM ? ' ' : ''}{crmName}{T.viewInCRMSuffix}</span>
        <span className="text-gray-500 text-xs">↗</span>
      </a>
    </div>
  )
}
