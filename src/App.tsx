import { useState } from 'react'
import eduicon from './assets/eduicon.png'
import './App.css'

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={eduicon} className="logo futura" alt="Logo Futura Educação" />
        </a>
      </div>
      <h1>Futura Educação</h1>
    </>
  )
}

export default App
