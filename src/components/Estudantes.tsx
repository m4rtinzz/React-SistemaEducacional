import React, { useState, useEffect } from 'react';

// Define a estrutura de dados de um estudante
interface Estudante {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  registeredAt: string;
  classId: number;
}

// Define a estrutura de dados de uma turma para o select
interface Turma {
  id: number;
  semester: string;
  room: string;
}

const API_URL_ESTUDANTES = 'https://api-estudo-educacao-1.onrender.com/students';
const API_URL_TURMAS = 'https://api-estudo-educacao-1.onrender.com/classes';

function Estudantes() {
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEstudante, setEditingEstudante] = useState<Estudante | null>(null);

  const fetchEstudantesETurmas = () => {
    Promise.all([
      fetch(API_URL_ESTUDANTES).then(res => res.json()),
      fetch(API_URL_TURMAS).then(res => res.json())
    ]).then(([estudantesData, turmasData]) => {
      setEstudantes(estudantesData);
      setTurmas(turmasData);
    });
  };

  useEffect(() => {
    fetchEstudantesETurmas();
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este estudante?')) {
      fetch(`${API_URL_ESTUDANTES}/${id}`, { method: 'DELETE' })
        .then(() => fetchEstudantesETurmas());
    }
  };

  const handleEdit = (estudante: Estudante) => {
    setEditingEstudante(estudante);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEstudante(null);
    setShowForm(true);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const estudanteData = {
      firstname: formData.get('firstname') as string,
      lastname: formData.get('lastname') as string,
      email: formData.get('email') as string,
      classId: Number(formData.get('classId')),
    };

    const method = editingEstudante ? 'PUT' : 'POST';
    const url = editingEstudante ? `${API_URL_ESTUDANTES}/${editingEstudante.id}` : API_URL_ESTUDANTES;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estudanteData),
    })
    .then(() => {
      setShowForm(false);
      setEditingEstudante(null);
      fetchEstudantesETurmas();
    });
  };

  return (
    <section>
      <h2>Estudantes Matriculados</h2>
      <button onClick={handleAddNew} className="btn-add">Adicionar Novo Estudante</button>

      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <h3>{editingEstudante ? 'Editar Estudante' : 'Adicionar Novo Estudante'}</h3>
          <input type="text" name="firstname" placeholder="Nome" defaultValue={editingEstudante?.firstname} required />
          <input type="text" name="lastname" placeholder="Sobrenome" defaultValue={editingEstudante?.lastname} required />
          <input type="email" name="email" placeholder="Email" defaultValue={editingEstudante?.email} required />
          <select name="classId" defaultValue={editingEstudante?.classId} required>
            <option value="" disabled>Selecione uma turma</option>
            {turmas.map(turma => (
              <option key={turma.id} value={turma.id}>
                Turma {turma.id} - {turma.semester}
              </option>
            ))}
          </select>
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
            <th>Sobrenome</th>
            <th>Email</th>
            <th>ID da Turma</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {estudantes.map(estudante => (
            <tr key={estudante.id}>
              <td>{estudante.firstname}</td>
              <td>{estudante.lastname}</td>
              <td>{estudante.email}</td>
              <td>{estudante.classId}</td>
              <td>
                <button onClick={() => handleEdit(estudante)}>Editar</button>
                <button onClick={() => handleDelete(estudante.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Estudantes;