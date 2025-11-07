 import { useState, useEffect } from 'react';
 
 // Define a estrutura de dados das notas
 interface Nota {
   id: number;
   studentId: number;
   classId: number;
   assessment: string;
   score: number;
   date: string;
 }
 
 function Notas() {
   const [notas, setNotas] = useState<Nota[]>([]);
 
   // Busca os dados na API quando o componente é montado
   useEffect(() => {
     fetch('https://api-estudo-educacao-1.onrender.com/grades')
       .then(response => response.json())
       .then(data => setNotas(data));
   }, []);
 
   return (
     <section>
       <h2>Notas</h2>
       <ul>
         {notas.map(nota => <li key={nota.studentId}>{nota.assessment} ({nota.score})</li>)}
       </ul>
     </section>
   );
 }
 
 export default Notas;
 