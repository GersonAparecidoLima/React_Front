import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import style from './ListaUsuarios.module.scss';

interface Usuario {
  id: string;
  nome: string;
}

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string>('');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [idFiltro, setIdFiltro] = useState<string>(''); // Estado para o filtro pelo ID
  const { id } = useParams<{ id: string }>();

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuarios');
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro('Erro desconhecido');
      }
    }
  };

  const fetchUsuarioPorId = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${id}`);
      if (!response.ok) {
        throw new Error('Usuário não encontrado');
      }
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro('Erro desconhecido');
      }
    }
  };

  const handleFiltroIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIdFiltro(event.target.value); // Atualiza o ID do filtro
  };

  useEffect(() => {
    if (id) {
      fetchUsuarioPorId(id);
    } else {
      fetchUsuarios();
    }
  }, [id]);

  const filteredUsuarios = idFiltro
    ? usuarios.filter((usuario) =>
        usuario.id.toLowerCase().includes(idFiltro.toLowerCase())
      )
    : usuarios;

  return (
    <div className={style.listaUsuarios}>
      <h2>{id ? `Usuário: ${usuario?.nome}` : 'Lista de Usuários'}</h2>
      {erro && <p className="erro">{erro}</p>}

      {/* Campo de Input para Filtro */}
      <div>
        <input
          type="text"
          value={idFiltro}
          onChange={handleFiltroIdChange}
          placeholder="Filtrar por ID"
          className={style.inputFiltro}
        />
      </div>

      {id ? (
        usuario ? (
          <div>
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Nome:</strong> {usuario.nome}</p>
          </div>
        ) : (
          <p>Carregando o usuário...</p>
        )
      ) : (
        <div>
          {/* Cabeçalho da Tabela com os rótulos Nome e ID */}
          <div className={style.header}>
            <span className={style.headerItem}><strong>Nome</strong></span>
            <span className={style.headerItem}><strong>ID</strong></span>
          </div>

          {/* Lista de Usuários */}
          <ul>
            {filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario) => (
                <li key={usuario.id}>
                  <span>{usuario.nome}</span>
                  <span>{usuario.id}</span>
                </li>
              ))
            ) : (
              <p>Nenhum usuário encontrado.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ListaUsuarios;
