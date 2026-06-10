import { createContext, useContext } from 'react'

export const LangContext = createContext('zh')
export const useLang = () => useContext(LangContext)
