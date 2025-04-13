// Controls.jsx
import React from "react";
import { ret_pos_arr } from "../DrawRectangle/DrawRectangle";

const Controls = ({ updateRectangles }) => {
  const handleEditar = () => {
    if (ret_pos_arr.length === 0) {
      alert("Nenhum retângulo para editar.");
      return;
    }
    // Exemplo: dobra o tamanho do primeiro retângulo
    ret_pos_arr[0][2] *= 2; // Dobra a largura
    ret_pos_arr[0][3] *= 2; // Dobra a altura
    console.log("Retângulo editado:", ret_pos_arr[0]);
    alert("Retângulo editado.");
    updateRectangles(); // Atualiza o canvas
  };

  const handleExcluir = () => {
    if (ret_pos_arr.length === 0) {
      alert("Nenhum retângulo para excluir.");
      return;
    }
    const removido = ret_pos_arr.pop(); // Remove o último retângulo
    console.log("Retângulo removido:", removido);
    alert("Último retângulo excluído.");
    updateRectangles(); // Atualiza o canvas
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ações de Retângulo</h2>
      <button onClick={handleEditar}>Editar</button>
      <button onClick={handleExcluir} style={{ marginLeft: "10px" }}>
        Excluir
      </button>
    </div>
  );
};

export default Controls;
