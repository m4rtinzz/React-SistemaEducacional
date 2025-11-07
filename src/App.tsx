import { Routes, Route, Link } from 'react-router-dom';
import eduicon from './assets/eduicon.png'
import './App.css'
import HomePage from './pages/HomePage';
import CursosPage from './pages/CursosPage';
import EstudantesPage from './pages/EstudantesPage';
import TurmasPage from './pages/TurmasPage';
import NotasPage from './pages/NotasPage';

function App() {
  return (
    <>
      <div>
        <img src={eduicon} className="logo futura" alt="Logo Futura Educação" />
      </div>
      <h1>Futura Educação</h1>

      <nav className="navbar">
        <Link to="/">Início</Link>
        <Link to="/cursos">Cursos</Link>
        <Link to="/turmas">Turmas</Link>
        <Link to="/estudantes">Estudantes</Link>
        <Link to="/notas">Notas</Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cursos" element={<CursosPage />} />
          <Route path="/turmas" element={<TurmasPage />} />
          <Route path="/estudantes" element={<EstudantesPage />} />
          <Route path="/notas" element={<NotasPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
