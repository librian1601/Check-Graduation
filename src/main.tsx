import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if (import.meta.env.PROD) { 
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  document.onkeydown = function(e) {
    if (e.keyCode === 123) return false;
    if (
      (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
      (e.ctrlKey && e.keyCode === 85)
    ) {
      return false;
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)