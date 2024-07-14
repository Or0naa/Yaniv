import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useLanguageStore } from './store';

export default function Layout() {
  useEffect(() => {
    if (performance.navigation.type === 1) {
      window.location.href = '/';
    }
  }, []);

  const toggleLanguage = useLanguageStore(state => state.toggleLanguage);
  const language = useLanguageStore(state => state.language);
  const setLanguage = (lan) => {
    toggleLanguage(lan);
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      {/* <div>
        <button onClick={() => setLanguage("heW")} className="languageToggle">
          עברית(לשון נקבה)
        </button>
        <button onClick={() => setLanguage("heM")} className="languageToggle">
          עברית(לשון זכר)
        </button>
        <button onClick={() => setLanguage("en")} className="languageToggle">
          English
        </button>
      </div> */}
      <Outlet />
    </>
  )
}
