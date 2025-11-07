import eduicon from './assets/eduicon.png'
import './App.css'
import Cursos from './components/Cursos';
import Estudantes from './components/Estudantes';
import Turmas from './components/Turmas';
import Notas from './components/Notas';

function App() {
  return (
    <>
      <div>
        <img src={eduicon} className="logo futura" alt="Logo Futura Educação" />
      </div>
      <h1>Futura Educação</h1>

      <nav className="navbar">
        <a href="#home">Início</a>
        <a href="#cursos">Cursos</a>
        <a href="#turmas">Turmas</a>
        <a href="#estudantes">Estudantes</a>
        <a href="#notas">Notas</a>
      </nav>

      <div className="lists-container">
        <Cursos />
        <Estudantes />
        <Turmas />
        <Notas />
      </div>
    </>
  )
}

export default App
