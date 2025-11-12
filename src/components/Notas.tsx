import React, { useState, useEffect } from 'react';

interface Nota {
  id: number;
  studentId: number;
  classId: number;
  assessment: 'Prova' | 'Trabalho';
  score: number;
}

interface Estudante {
  id: number;
  firstname: string;
  lastname: string;
  classId: number;
}

interface Turma {
  id: number;
  semester: string;
  room: string;
}

const API_URL_GRADES = 'https://api-estudo-educacao-1.onrender.com/grades';
const API_URL_STUDENTS = 'https://api-estudo-educacao-1.onrender.com/students';
const API_URL_CLASSES = 'https://api-estudo-educacao-1.onrender.com/classes';

function Notas() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>('');
  const [editedScores, setEditedScores] = useState<{ [key: string]: number | string }>({});

  const fetchData = () => {
    Promise.all([
      fetch(API_URL_GRADES).then(res => res.json()),
      fetch(API_URL_STUDENTS).then(res => res.json()),
      fetch(API_URL_CLASSES).then(res => res.json()),
    ]).then(([notasData, estudantesData, turmasData]) => {
      setNotas(notasData);
      setEstudantes(estudantesData);
      setTurmas(turmasData);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScoreChange = (studentId: number, assessment: 'Prova' | 'Trabalho', value: string) => {
    const key = `${studentId}-${assessment}`;
    setEditedScores(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveScore = async (studentId: number, assessment: 'Prova' | 'Trabalho') => {
    const key = `${studentId}-${assessment}`;
    const newScore = editedScores[key];

    if (newScore === undefined || newScore === '') {
      alert('Por favor, insira uma nota válida.');
      return;
    }

    const existingNota = notas.find(n => n.studentId === studentId && n.assessment === assessment && n.classId === Number(selectedTurmaId));
    
    const method = existingNota ? 'PUT' : 'POST';
    const url = existingNota ? `${API_URL_GRADES}/${existingNota.id}` : API_URL_GRADES;

    const body = {
      studentId,
      classId: Number(selectedTurmaId),
      assessment,
      score: Number(newScore),
    };

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    alert(`Nota de ${assessment} salva com sucesso!`);
    fetchData(); // Re-fetch data to show the updated score
    setEditedScores(prev => {
      const newEdited = { ...prev };
      delete newEdited[key];
      return newEdited;
    });
  };

  const getScore = (studentId: number, assessment: 'Prova' | 'Trabalho') => {
    const key = `${studentId}-${assessment}`;
    if (editedScores[key] !== undefined) {
      return editedScores[key];
    }
    const nota = notas.find(n => n.studentId === studentId && n.assessment === assessment && n.classId === Number(selectedTurmaId));
    return nota ? nota.score : '';
  };

  const filteredEstudantes = estudantes.filter(e => e.classId === Number(selectedTurmaId));

  return (
    <section>
      <h2>Lançamento de Notas</h2>
      <select onChange={(e) => setSelectedTurmaId(e.target.value)} value={selectedTurmaId}>
        <option value="" disabled>Selecione uma Turma</option>
        {turmas.map(turma => (
          <option key={turma.id} value={turma.id}>Turma {turma.id} - {turma.semester}</option>
        ))}
      </select>

      {selectedTurmaId && (
        <table>
          <thead>
            <tr>
              <th>Estudante</th>
              <th>Nota Prova</th>
              <th>Ações Prova</th>
              <th>Nota Trabalho</th>
              <th>Ações Trabalho</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstudantes.map(estudante => (
              <tr key={estudante.id}>
                <td>{estudante.firstname} {estudante.lastname}</td>
                <td><input type="number" value={getScore(estudante.id, 'Prova')} onChange={(e) => handleScoreChange(estudante.id, 'Prova', e.target.value)} placeholder="-" min="0" max="10" /></td>
                <td><button onClick={() => handleSaveScore(estudante.id, 'Prova')}>Salvar</button></td>
                <td><input type="number" value={getScore(estudante.id, 'Trabalho')} onChange={(e) => handleScoreChange(estudante.id, 'Trabalho', e.target.value)} placeholder="-" min="0" max="10" /></td>
                <td><button onClick={() => handleSaveScore(estudante.id, 'Trabalho')}>Salvar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Notas;
 