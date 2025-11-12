 import { useState, useEffect } from 'react';

interface Turma {
  id: number;
  courseId: number;
  teacherId: number;
  semester: string;
  room: string;
}

interface Curso {
  title: string;
  id: string;
}

const API_URL_TURMAS = 'https://api-estudo-educacao-1.onrender.com/classes';
const API_URL_CURSOS = 'https://api-estudo-educacao-1.onrender.com/courses';

function Turmas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);

  const fetchTurmasECursos = () => {
    Promise.all([
      fetch(API_URL_TURMAS).then(res => res.json()),
      fetch(API_URL_CURSOS).then(res => res.json())
    ]).then(([turmasData, cursosData]: [Turma[], Curso[]]) => {
      setTurmas(turmasData);
      setCursos(cursosData);
    });
  };

  useEffect(() => {
    fetchTurmasECursos();
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      fetch(`${API_URL_TURMAS}/${id}`, { method: 'DELETE' })
        .then(() => fetchTurmasECursos());
    }
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingTurma(null);
    setShowForm(true);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const turmaData = {
      courseId: Number(formData.get('courseId')),
      teacherId: Number(formData.get('teacherId')),
      semester: formData.get('semester'),
      room: formData.get('room'),
    };

    const method = editingTurma ? 'PUT' : 'POST';
    const url = editingTurma ? `${API_URL_TURMAS}/${editingTurma.id}` : API_URL_TURMAS;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(turmaData),
    })
    .then(() => {
      setShowForm(false);
      setEditingTurma(null);
      fetchTurmasECursos();
    });
  };

  return (
    <section>
      <h2>Gerenciamento de Turmas</h2>
      <button onClick={handleAddNew} className="btn-add">Adicionar Nova Turma</button>

      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <h3>{editingTurma ? 'Editar Turma' : 'Adicionar Nova Turma'}</h3>
          <select name="courseId" defaultValue={editingTurma?.courseId} required>
            <option value="" disabled>Selecione um curso</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>{curso.title}</option>
            ))}
          </select>
          <input type="number" name="teacherId" placeholder="Id do Professor" defaultValue={editingTurma?.teacherId} required />
          <input type="text" name="semester" placeholder="Semestre (ex: 2025.2)" defaultValue={editingTurma?.semester} required />
          <input type="text" name="room" placeholder="Sala" defaultValue={editingTurma?.room} required />
          <div>
            <button type="submit" className="btn-add">Salvar</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Curso</th>
            <th>Id do Professor</th>
            <th>Semestre</th>
            <th>Sala</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {turmas.map(turma => (
            <tr key={turma.id}>
              <td>{cursos.find(c => c.id === String(turma.courseId))?.title || 'Curso não encontrado'}</td>
              <td>{turma.teacherId}</td>
              <td>{turma.semester}</td>
              <td>{turma.room}</td>
              <td>
                <button onClick={() => handleEdit(turma)}>Editar</button>
                <button onClick={() => handleDelete(turma.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Turmas;