import { useState } from 'react'
import { LangContext } from './LangContext.js'
import { t } from './i18n.js'
import BrainChat from './components/BrainChat.jsx'
import MeetingDetail from './components/MeetingDetail.jsx'
import SettingsPage from './components/SettingsPage.jsx'

export default function App() {
  const [lang, setLang] = useState('zh')
  const [page, setPage] = useState('meeting')
  const T = t[lang]

  const [isBusinessMeeting, setIsBusinessMeeting] = useState(true)
  const [adminConfigured, setAdminConfigured] = useState(false)
  const [userHadPersonalConfig, setUserHadPersonalConfig] = useState(true)

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-gray-950 text-white flex">
        {/* Sidebar nav */}
        <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-2 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-sm font-bold">B</div>
            <span className="font-semibold text-sm">Brain</span>
            <button
              onClick={() => setLang(l => l === 'zh' ? 'ja' : 'zh')}
              className="ml-auto text-xs px-2 py-0.5 rounded-full border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-colors"
            >
              {lang === 'zh' ? '日本語' : '中文'}
            </button>
          </div>
          {[
            { id: 'brain', icon: '💬', label: 'Brain' },
            { id: 'meeting', icon: '📋', label: T.meetings },
            { id: 'settings', icon: '⚙️', label: T.settings },
          ].map(({ id, icon, label }) => (
            <button key={id} onClick={() => setPage(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${page === id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}

          {/* Demo toggles */}
          <div className="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-2">
            <p className="text-xs text-gray-600 mb-1">{lang === 'zh' ? '演示状态' : 'デモ状態'}</p>
            {T.demoLabels.map((label, i) => {
              const [val, setter] = [[isBusinessMeeting, setIsBusinessMeeting], [adminConfigured, setAdminConfigured], [userHadPersonalConfig, setUserHadPersonalConfig]][i]
              return (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} className="accent-violet-500" />
                  <span className="text-xs text-gray-500">{label}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex min-w-0">
          {page === 'brain' && (
            <BrainChat
              lang={lang}
              adminConfigured={adminConfigured}
              userHadPersonalConfig={userHadPersonalConfig}
            />
          )}
          {page === 'meeting' && (
            <MeetingDetail
              lang={lang}
              isBusinessMeeting={isBusinessMeeting}
              adminConfigured={adminConfigured}
              userHadPersonalConfig={userHadPersonalConfig}
            />
          )}
          {page === 'settings' && <SettingsPage />}
        </div>
      </div>
    </LangContext.Provider>
  )
}
