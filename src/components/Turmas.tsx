 import { useState, useEffect } from 'react';

interface Turma {
  id: number;
  courseId: number;
  teacherId: number;
  semester: string;
  room: string;
}

interface Curso {
  name: string;
  id: number;
}

const API_URL_TURMAS = 'https://api-estudo-educacao-1.onrender.com/turmas';
const API_URL_CURSOS = 'https://api-estudo-educacao-1.onrender.com/cursos';

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
      // Mapeia o nome do curso para cada turma
      const turmasComNomes = turmasData.map(turma => {
        const curso = cursosData.find(c => c.id === turma.courseId);
        return { ...turma, nome_curso: curso ? curso.nome : 'Curso não encontrado' };
      });
      setTurmas(turmasComNomes);
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
      courseId: Number(formData.get('id_curso')),
      teacherId: formData.get('teacherId') as string,
      semester: formData.get('semester') as string,
      room: formData.get('room') as string,
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
          <select name="id_curso" defaultValue={editingTurma?.id_curso} required>
            <option value="" disabled>Selecione um curso</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>{curso.nome}</option>
            ))}
          </select>
          <input type="text" name="teacherId" placeholder="Id do Professor" defaultValue={editingTurma?.teacherId} required />
          <input type="text" name="semestre" placeholder="Semestre (ex: 2025.2)" defaultValue={editingTurma?.semester} required />
          <input type="text" name="sala" placeholder="Sala" defaultValue={editingTurma?.sala} required />
          <div>
            <button type="submit" className="btn-add">Salvar</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Id do Curso</th>
            <th>Id do Professor</th>
            <th>Semestre</th>
            <th>Sala</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {turmas.map(turma => (
            <tr key={turma.id}>
              <td>{turma.courseId}</td>
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