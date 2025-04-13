// App.jsx
import React, { useRef } from "react";
import DrawRectangle from "./components/DrawRectangle/DrawRectangle";
import Controls from "./components/Controls/Controls";

const App = () => {
  const drawRectRef = useRef(null);

  const updateRectangles = () => {
    if (drawRectRef.current) {
      // Certifica que a função está disponível
      drawRectRef.current.updateRectangles();
    }
  };

  return (
    <div>
      <h1>Editor de Retângulos</h1>
      <Controls updateRectangles={updateRectangles} />
      <DrawRectangle ref={drawRectRef} />
    </div>
  );
};

export default App;
