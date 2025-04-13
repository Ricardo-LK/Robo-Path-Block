// DrawRectangle.jsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import './DrawRectangle.css';

export let ret_pos_arr = [];

const DrawRectangle = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const imageRef = useRef(new Image());

  const [isDrawing, setIsDrawing] = useState(false);
  const startX = useRef(null);
  const startY = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d'); 
    imageRef.current.src = '/images/planta1.png';
    imageRef.current.onload = () => {
      canvas.width = imageRef.current.width;
      canvas.height = imageRef.current.height;
      context.drawImage(imageRef.current, 0, 0);
      context.lineCap = 'round';
      context.strokeStyle = 'black';
      context.lineWidth = 5;
      contextRef.current = context;
    };
  }, []);

  const startDrawingRectangle = ({ nativeEvent }) => {
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    startX.current = (nativeEvent.clientX - rect.left) * scaleX; 
    startY.current = (nativeEvent.clientY - rect.top) * scaleY;
    setIsDrawing(true); 
  };

  const drawing = ({ nativeEvent }) => {
    if (!isDrawing) return;
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
  };

  const stopDrawingRectangle = ({ nativeEvent }) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const newMouseX = (nativeEvent.clientX - rect.left) * scaleX;
    const newMouseY = (nativeEvent.clientY - rect.top) * scaleY;
    const rectWidth = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    ret_pos_arr.push([startX.current, startY.current, rectWidth, rectHeight]);
    console.log(ret_pos_arr);
    setIsDrawing(false);
    updateRectangles();
  };

  const updateRectangles = () => { 
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current.drawImage(imageRef.current, 0, 0);
    for (let i = 0; i < ret_pos_arr.length; i++) {
      contextRef.current.strokeRect(
        ret_pos_arr[i][0],
        ret_pos_arr[i][1],
        ret_pos_arr[i][2],
        ret_pos_arr[i][3]
      );
      contextRef.current.fillStyle = "gray";
      contextRef.current.fillRect(
        ret_pos_arr[i][0],
        ret_pos_arr[i][1],
        ret_pos_arr[i][2],
        ret_pos_arr[i][3]
      );
    }
  };

  // Expondo o método para componentes externos
  useImperativeHandle(ref, () => ({
    updateRectangles
  }));

  return (
    <div className="canvas-container-wrapper">
      <canvas
        className="canvas-container-rect"
        ref={canvasRef}
        onMouseDown={startDrawingRectangle}
        onMouseMove={isDrawing ? drawing : null}
        onMouseUp={isDrawing ? stopDrawingRectangle : null}
        onMouseLeave={isDrawing ? stopDrawingRectangle : null}
      ></canvas>
    </div>
  );
});

export default DrawRectangle;
