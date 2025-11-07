import { useState, useEffect } from 'react';

interface Curso {
  
  id: string;
  title: string;
  code: string;
  credits: number;
}

const API_URL = 'https://api-estudo-educacao-1.onrender.com/courses';

function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);

  const fetchCursos = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => setCursos(data));
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => {
          // Atualiza a lista de cursos após a exclusão
          setCursos(prev => prev.filter(curso => curso.id !== id));
        });
    }
  };

  const handleEdit = (curso: Curso) => {
    setEditingCurso(curso);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCurso(null);
    setShowForm(true);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cursoData = {
      nome: formData.get('nome') as string,
      id: formData.get('id') as string,
    };

    const method = editingCurso ? 'PUT' : 'POST';
    const url = editingCurso ? `${API_URL}/${editingCurso.id}` : API_URL;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cursoData),
    })
    .then(() => {
      setShowForm(false);
      setEditingCurso(null);
      fetchCursos(); // Re-busca os cursos para mostrar a lista atualizada
    });
  };

  return (
    <section>
      <h2>Cursos Disponíveis</h2>
      <button onClick={handleAddNew} className="btn-add">Adicionar Novo Curso</button>

      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <h3>{editingCurso ? 'Editar Curso' : 'Adicionar Novo Curso'}</h3>
          <input 
            type="text" 
            name="name" 
            placeholder="Nome do curso" 
            defaultValue={editingCurso?.title} 
            required 
          />
          <input 
            type="string" 
            name="id" 
            placeholder="ID do curso" 
            defaultValue={editingCurso?.id} 
            required 
          />
          <div>
            <button type="submit" className="btn-add">Salvar</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>ID</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id}>
              <td>{curso.title.charAt(0).toUpperCase() + curso.title.slice(1)}</td>
              <td>{curso.id}</td>
              <td>
                <button onClick={() => handleEdit(curso)}>Editar</button>
                <button onClick={() => handleDelete(curso.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Cursos;