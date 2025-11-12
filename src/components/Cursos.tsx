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
      title: formData.get('title') as string,
      code: formData.get('code') as string,
      credits: Number(formData.get('credits')),
      id: editingCurso ? editingCurso.id : String(Date.now()), // Mantém o ID na edição, gera um novo na criação
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
            name="title" 
            placeholder="Nome do curso" 
            defaultValue={editingCurso?.title} 
            required 
          />
          <input 
            type="text" 
            name="code" 
            placeholder="Código do curso" 
            defaultValue={editingCurso?.code} 
            required 
          />
          <input 
            type="number" 
            name="credits" 
            placeholder="Créditos" 
            defaultValue={editingCurso?.credits} 
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
            <th>Código</th>
            <th>Créditos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id}>
              <td>{curso.title}</td>
              <td>{curso.code}</td>
              <td>{curso.credits}</td>
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