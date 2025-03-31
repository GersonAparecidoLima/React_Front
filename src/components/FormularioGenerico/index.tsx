import React, { useState } from 'react';
import Botao from '../Botao';
import style from './FormularioGenerico.module.scss';

interface Campo {
  label: string;
  tipo: string;
  nome: string;
  valor: string;
  placeholder?: string;
  required?: boolean;
}

interface Props {
  campos: Campo[];
  onSubmit: (dados: { [key: string]: string }) => void;
  tipoFormulario?: string;  // Adicionando tipoFormulario como opcional
}

function FormularioGenerico({ campos, onSubmit, tipoFormulario }: Props) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <form className={`${style.formularioGenerico} ${tipoFormulario ? style[tipoFormulario] : ''}`} onSubmit={handleSubmit}>
      {campos.map((campo, index) => (
        <div key={index} className={style.inputContainer}>
          <label htmlFor={campo.nome}>{campo.label}</label>
          <input
            type={campo.tipo}
            name={campo.nome}
            id={campo.nome}
            value={formData[campo.nome] || campo.valor}
            onChange={handleChange}
            placeholder={campo.placeholder}
            required={campo.required}
          />
        </div>
      ))}
      <Botao type="submit">Enviar</Botao>
    </form>
  );
}

export default FormularioGenerico;
