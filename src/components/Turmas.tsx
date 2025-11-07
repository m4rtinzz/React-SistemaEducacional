 import { useState, useEffect } from 'react';
 
 // Define a estrutura de dados de uma turma
 interface Turma {
   id: number;
   courseId: number;
   teacherId: number;
   semester: string;
   room: string;
 }
 
 function Turmas() {
   const [turmas, setTurmas] = useState<Turma[]>([]);
 
   // Busca os dados na API quando o componente é montado
   useEffect(() => {
     fetch('https://api-estudo-educacao-1.onrender.com/classes')
       .then(response => response.json())
       .then(data => setTurmas(data));
   }, []);
 
   return (
     <section>
       <h2>Turmas</h2>
       <ul>
         {turmas.map(turma => <li key={turma.id}>{turma.courseId} ({turma.room})</li>)}
       </ul>
     </section>
   );
 }
 
 export default Turmas;