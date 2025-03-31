import React, { useState } from 'react';
import FormularioGenerico from '../../components/FormularioGenerico'; // Importando o FormularioGenerico
import style from './Cadastro.module.scss';

function Cadastro() {
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const campos = [
    { label: 'Nome', tipo: 'text', nome: 'nome', valor: '', required: true },
    { label: 'Email', tipo: 'email', nome: 'email', valor: '', required: true },
    { label: 'Senha', tipo: 'password', nome: 'senha', valor: '', required: true },
  ];

  /*
  // Função de envio do formulário
  async function handleSubmit(dados: { [key: string]: string }) {
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
      }

      const data = await response.json();
      console.log('Usuário cadastrado com sucesso:', data);
      setSucesso(data.messagem); // Exibe a mensagem de sucesso na tela

    } catch (error) {
      console.error('Erro:', error);
      setErro('Falha ao cadastrar usuário. Tente novamente.');
    }
  }
*/

async function handleSubmit(dados: { [key: string]: string }) {
  try {
    const response = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Garante que o formato de envio é JSON
      },
      body: JSON.stringify(dados), // Converte o objeto `dados` para JSON
    });

    if (!response.ok) {
      const errorData = await response.json(); // Tenta capturar o erro enviado pelo backend
      throw new Error(errorData.message || 'Erro ao cadastrar usuário');
    }

    const data = await response.json();
    console.log('Usuário cadastrado com sucesso:', data);
    setSucesso(data.messagem); // Exibe a mensagem de sucesso
  } catch (error) {
    console.error('Erro:', error);
    setErro('Falha ao cadastrar usuário. Tente novamente.');
  }
}


  return (
    <div className={style.cadastro}>
      <h2>Cadastro de Usuário</h2>
      {/* Exibe a mensagem de erro ou sucesso */}
      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}
      <FormularioGenerico campos={campos} onSubmit={handleSubmit} tipoFormulario="cadastro" />
    </div>
  );
}

export default Cadastro;
