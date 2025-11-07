import { useState, useEffect } from 'react';

// Define a estrutura de dados de um curso
interface Curso {
  name: string;
  id: number;
}

function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);

  // Busca os dados na API quando o componente é montado
  useEffect(() => {
    fetch('https://api-estudo-educacao-1.onrender.com/courses')
      .then(response => response.json())
      .then(data => setCursos(data));
  }, []);

  return (
    <section>
      <h2>Cursos Disponíveis</h2>
      <ul>
        {cursos.map(curso => <li key={curso.name}>Código: {curso.id}</li>)}
      </ul>
    </section>
  );
}

export default Cursos;