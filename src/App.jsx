import { useState } from 'react'
import { LangContext } from './LangContext.js'
import { t } from './i18n.js'
import BrainChat from './components/BrainChat.jsx'

export default function App() {
  const [lang, setLang] = useState('zh')
  const T = t[lang]

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-gray-950 text-white flex">
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
          {[['💬', T.newChat, true], ['📅', T.meetings], ['🔗', T.integrations], ['⚙️', T.settings]].map(([icon, label, active]) => (
            <button key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <BrainChat />
        </div>
      </div>
    </LangContext.Provider>
  )
}
