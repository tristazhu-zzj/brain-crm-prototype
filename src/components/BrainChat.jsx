import { t } from '../i18n.js'
import { BrainSidebar } from './MeetingDetail.jsx'

export default function BrainChat({ lang, adminConfigured, userHadPersonalConfig }) {
  const T = t[lang]

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-sm font-bold">B</div>
        <div>
          <h1 className="text-base font-semibold">Brain</h1>
          <p className="text-xs text-gray-500">{T.brainPageSubtitle}</p>
        </div>
      </div>

      <div className="flex-1 flex justify-center min-h-0 px-6">
        <div className="w-full max-w-3xl flex flex-col min-h-0 border-x border-gray-800/60">
          <BrainSidebar
            lang={lang}
            T={T}
            adminConfigured={adminConfigured}
            userHadPersonalConfig={userHadPersonalConfig}
            context="standalone"
          />
        </div>
      </div>
    </div>
  )
}
