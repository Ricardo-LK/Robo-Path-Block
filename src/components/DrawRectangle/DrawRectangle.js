import './DrawRectangle.css';
import { useEffect, useRef, useState } from 'react';

let ret_pos_arr = []

const DrawRectangle = () => 
{
  const canvasRef = useRef(null); //useRef inicia null para futuramente apontar para o canvas
  const contextRef = useRef(null); //ferramente de desenho do canvas
  const imageRef = useRef(new Image());

  const [isDrawing, setIsDrawing] = useState(false);  //UseState serve para guardar valores que mudam com o tempo
    //e que precisam atualizar na tela
  //isDrawing é o valor atual, setIsDrawing é o valor que você deve usar para mudar o valor e atualizar  a tela
  // Use State retorna um valor com dois items [ a, b]

  const canvasOffSetX = useRef(0); //guarda posição do canvas na tela
  const canvasOffSetY = useRef(0);
  const startX = useRef(null); //posição inicial do mouse x,y
  const startY = useRef(null);

  useEffect(() => { //é aqui onde o canvas é inicializado, a imagem é carregada e o context do desenho configurado
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d'); 

    imageRef.current.src = '/images/planta1.png'; //IMAGEM
    imageRef.current.onload = () => {
      canvas.width = imageRef.current.width; //Aqui define que o canvas precisa ter o mesmo tamanho da imagem
      canvas.height = imageRef.current.height;

      context.drawImage(imageRef.current, 0, 0); //desenha a imagem carregada, começando do ponto 0,0

      context.lineCap = 'round';        //inicializa as propriedades do traço desenhado
      context.strokeStyle = 'black';
      context.lineWidth = 5;
      contextRef.current = context; //para uso futuro

      // Calcular a posição do canvas usando offsetLeft e offsetTop
      canvasOffSetX.current = canvas.offsetLeft;
      canvasOffSetY.current = canvas.offsetTop;
    };
  }, []); //o colchete [] indica que isso só roda uma vez, ja que é uma inicialização

  const startDrawingRectangle = ({ nativeEvent }) => { //nativeEvent contem as informações do clique do mouse e seus movimentos, que será usado como parametros
    nativeEvent.preventDefault(); //impede que se possa arrastar a imagem ou selecionar texto (em azul, saca?)
    nativeEvent.stopPropagation(); //segurança

    const rect = canvasRef.current.getBoundingClientRect(); //AQUI é a linha responsavel para pegar a posição real do canvas independente de zoom
    const scaleX = canvasRef.current.width / rect.width; //calculo para corrigir o zoom
    const scaleY = canvasRef.current.height / rect.height;

    //salva as posições iniciais do clique, subtrai rect.left e top para achar onde o clique ocorreu dentro do canvas e multiplica scalex e y para compensar o zoom
    startX.current = (nativeEvent.clientX - rect.left) * scaleX; 
    startY.current = (nativeEvent.clientY - rect.top) * scaleY;

    setIsDrawing(true); 
  };

  const drawing = ({ nativeEvent }) => { //essa função é chamada sempre que o mouse se move
    if (!isDrawing) return;

    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
  };

  const stopDrawingRectangle = ({ nativeEvent }) => {
    const rect = canvasRef.current.getBoundingClientRect(); //Nesta parte a função getBoundingClientRect() pega a quantidade em pixels-
    //- que o canvas está sendo mostrado na tela, ou seja, ao variar o zoom da página, essa função retorna o tamanho em ''tempo real''-
    //do canvas
    const scaleX = canvasRef.current.width / rect.width; //e então, uma divisão simples entre a altura e a largura do canvas e a altura-
    //- e largura do canvas em tempo real (rect) é feita, permitindo que a criação de quadrados funcione sempre dentro da proporção correta.
    const scaleY = canvasRef.current.height / rect.height;

    const newMouseX = (nativeEvent.clientX - rect.left) * scaleX;
    const newMouseY = (nativeEvent.clientY - rect.top) * scaleY;

    const rectWidth = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    ret_pos_arr.push([startX.current, startY.current, rectWidth, rectHeight])
    console.log(ret_pos_arr)
    setIsDrawing(false);

    drawRectangles();
  };
  
  const drawRectangles = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current.drawImage(imageRef.current, 0, 0);

    for (let i = 0; i < ret_pos_arr.length; i++)
    {
      contextRef.current.strokeRect(ret_pos_arr[i][0], ret_pos_arr[i][1], ret_pos_arr[i][2], ret_pos_arr[i][3]);
    
      contextRef.current.fillStyle = "gray";
      contextRef.current.fillRect(ret_pos_arr[i][0], ret_pos_arr[i][1], ret_pos_arr[i][2], ret_pos_arr[i][3]);
    }

    if (ret_pos_arr.length == 3)
      ret_pos_arr.pop()
      
  }


  return (                                  //O retorno da função é a geração da div do canvas e os retangulos desenhados
    <div className="canvas-container-wrapper">
      <canvas
        className="canvas-container-rect"
        ref={canvasRef}
        onMouseDown={startDrawingRectangle} //Ao clicar, inicializa o processo de desenho
        onMouseMove={isDrawing ? drawing : null} //Ao arrastar o mouse o retangulo é desenhado
        onMouseUp={isDrawing ? stopDrawingRectangle : null} //Ao soltar o mouse ele para de desenhar o retangulo
        onMouseLeave={isDrawing ? stopDrawingRectangle : null} //onMouseLeave serve como uma proteção inteligente, caso o mouse ''leaves'' a area de efeito, -
        //- ,neste caso o canvas, ele tambem para de desenhar, caso o contrario, ele continuaria desenhando o quadrado mesmo com o mouse para fora
      ></canvas>
    </div>
  );
};

export default DrawRectangle;