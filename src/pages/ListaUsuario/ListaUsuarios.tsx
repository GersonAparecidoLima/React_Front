import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para pegar o ID da URL (caso esteja buscando um usuário específico)
import style from './ListaUsuarios.module.scss'; // Verifique se o caminho está correto


// Definindo o tipo dos dados que vamos receber do backend
interface Usuario {
  id: string;
  nome: string;
}

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string>('');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
  const { id } = useParams<{ id: string }>(); // Para capturar o parâmetro 'id' da URL, se existir

  // Função para buscar todos os usuários
  const fetchUsuarios = async () => {
    setLoading(true); // Ativa o carregamento
    try {
      const response = await fetch('http://localhost:3000/usuarios');
      if (!response.ok) {
        throw new Error('Erro ao carregar a lista de usuários');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro('Erro desconhecido');
      }
    } finally {
      setLoading(false); // Desativa o carregamento após a resposta
    }
  };

  // Função para buscar um usuário específico por ID
  const fetchUsuarioPorId = async (id: string) => {
    setLoading(true); // Ativa o carregamento
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
    } finally {
      setLoading(false); // Desativa o carregamento após a resposta
    }
  };

  // Efeito para fazer a requisição assim que o componente for renderizado ou quando o ID mudar
  useEffect(() => {
    if (id) {
      fetchUsuarioPorId(id); // Se houver ID na URL, busca o usuário específico
    } else {
      fetchUsuarios(); // Se não houver ID, busca todos os usuários
    }
  }, [id]);

  return (
    <div className={style.listaUsuarios}>
      <h2>{id ? `Usuário: ${usuario?.nome}` : 'Lista de Usuários'}</h2>

      {erro && <p className="erro">{erro}</p>} {/* Exibe erro se houver */}

      {loading ? (
        <p>Carregando...</p> // Exibe mensagem de carregamento enquanto a requisição está em andamento
      ) : id ? (
        // Caso esteja buscando um usuário específico, exibe o usuário encontrado
        usuario ? (
          <div>
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Nome:</strong> {usuario.nome}</p>
          </div>
        ) : (
          <p>Usuário não encontrado.</p> // Mensagem caso o usuário não seja encontrado
        )
      ) : (
        // Caso contrário, exibe a lista de todos os usuários
        <ul>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <li key={usuario.id}>
                <strong>{usuario.nome}</strong> (ID: {usuario.id})
              </li>
            ))
          ) : (
            <p>Nenhum usuário encontrado.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default ListaUsuarios;
