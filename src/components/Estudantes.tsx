import { useState, useEffect } from 'react';

// Define a estrutura de dados de um estudante
interface Estudante {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  registeredAt: string;
  classId: number;
}

function Estudantes() {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);

  useEffect(() => {
    fetch('https://api-estudo-educacao-1.onrender.com/students')
      .then(response => response.json())
      .then(data => setEstudantes(data));
  }, []);

  return (
    <section>
      <h2>Estudantes Matriculados</h2>
      <ul>
        {estudantes.map(estudante => <li key={estudante.id}>{estudante.firstname}</li>)}
      </ul>
    </section>
  );
}

export default Estudantes;