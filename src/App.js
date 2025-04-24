

// final code part-1

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import ColorThief from 'color-thief-browser';
// import logo from './assets/logo.png';

const App = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [colors, setColors] = useState([]);
  const [gradient, setGradient] = useState('');
  const [direction, setDirection] = useState('to right');
  const imageRef = useRef();
  const canvasRef = useRef();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });

  const handleImageLoad = async () => {
    const colorThief = new ColorThief();
    const img = imageRef.current;

    if (img && img.complete) {
      const palette = await colorThief.getPalette(img, 5);
      setColors(palette);
    }
  };

  const rgbToHex = (r, g, b) =>
    '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

  // 🎨 Generate gradient string
  useEffect(() => {
    if (colors.length >= 2) {
      const hex1 = rgbToHex(...colors[0]);
      const hex2 = rgbToHex(...colors[1]);
      setGradient(`linear-gradient(${direction}, ${hex1}, ${hex2})`);
    }
  }, [colors, direction]);

  // 🖼️ Draw to canvas
  useEffect(() => {
    if (colors.length >= 2) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const [x0, y0, x1, y1] = getGradientCoords(canvas, direction);

      const grd = ctx.createLinearGradient(x0, y0, x1, y1);
      grd.addColorStop(0, rgbToHex(...colors[0]));
      grd.addColorStop(1, rgbToHex(...colors[1]));
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [colors, direction]);

  const getGradientCoords = (canvas, direction) => {
    switch (direction) {
      case 'to right':
        return [0, 0, canvas.width, 0];
      case 'to bottom':
        return [0, 0, 0, canvas.height];
      case 'to bottom right':
        return [0, 0, canvas.width, canvas.height];
      case 'to top right':
        return [0, canvas.height, canvas.width, 0];
      default:
        return [0, 0, canvas.width, 0];
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'gradient-wallpaper.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex).then(() => {
      alert(`${hex} copied to clipboard!`);
    });
  };

  return (
    <Page style={{ background: gradient || '#eeeeee' }}>
      {/* title */}
      
       <Title>🎨 Gradient Wallpaper Generator</Title>
      <DropArea {...getRootProps()}>
        <input {...getInputProps()} />
        <p>📷 Drag & drop an image here, or click to upload</p>
      </DropArea>

      {imageSrc && (
        <>
          <ImagePreview>
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Uploaded"
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
            />
          </ImagePreview>

          <Controls>
            <label>🎯 Gradient Direction:</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)}>
              <option value="to right">Left → Right</option>
              <option value="to bottom">Top → Bottom</option>
              <option value="to bottom right">Diagonal ↘</option>
              <option value="to top right">Diagonal ↗</option>
            </select>
            <Button onClick={downloadImage}>⬇️ Download Gradient</Button>
          </Controls>

          {colors.length > 0 && (
            <ColorPalette>
              <h3>🌈 Extracted Colors:</h3>
              {colors.map((color, index) => {
                const hex = rgbToHex(...color);
                return (
                  <ColorBox key={index}>
                    <ColorPreview style={{ backgroundColor: hex }} />
                    <HexCode>
                      {hex}{' '}
                      <CopyButton onClick={() => copyToClipboard(hex)}>📋 Copy</CopyButton>
                    </HexCode>
                  </ColorBox>
                );
              })}
            </ColorPalette>
          )}

          <canvas ref={canvasRef} width={1920} height={1080} style={{ display: 'none' }} />
        </>
      )}
    </Page>
  );
};

// Styled Components

// style title


const Title = styled.h1`
  font-size: 2.2rem;
  color: white;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.4);
  z-index: 2;
`;

const Page = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background 0.5s ease;
`;

const DropArea = styled.div`
  border: 2px dashed #aaa;
  padding: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
  cursor: pointer;
  font-size: 1.2rem;
`;

const ImagePreview = styled.div`
  margin-top: 20px;
  img {
    max-width: 300px;
    max-height: 300px;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Controls = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    margin-bottom: 5px;
    font-size: 1rem;
  }

  select {
    padding: 5px 10px;
    margin-bottom: 10px;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  background: #222;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #444;
  }
`;

const ColorPalette = styled.div`
  margin-top: 30px;
  text-align: center;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const ColorBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
`;

const ColorPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const HexCode = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const CopyButton = styled.button`
  margin-left: 10px;
  padding: 5px;
  font-size: 0.9rem;
  background: #444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #666;
  }
`;

export default App;










// final code part-2


// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import styled from 'styled-components';
// import ColorThief from 'color-thief-browser';

// const App = () => {
//   const [imageSrc, setImageSrc] = useState(null);
//   const [colors, setColors] = useState([]);
//   const [gradient, setGradient] = useState('');
//   const [direction, setDirection] = useState('to right');
//   const [darkMode, setDarkMode] = useState(false);
//   const imageRef = useRef();
//   const canvasRef = useRef();

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//       setImageSrc(reader.result);
//     };
//     reader.readAsDataURL(file);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { 'image/*': [] },
//     onDrop,
//   });

//   const handleImageLoad = async () => {
//     const colorThief = new ColorThief();
//     const img = imageRef.current;
//     if (img && img.complete) {
//       const palette = await colorThief.getPalette(img, 5);
//       setColors(palette);
//     }
//   };

//   const rgbToHex = (r, g, b) =>
//     '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

//   useEffect(() => {
//     if (colors.length >= 2) {
//       const hex1 = rgbToHex(...colors[0]);
//       const hex2 = rgbToHex(...colors[1]);
//       setGradient(`linear-gradient(${direction}, ${hex1}, ${hex2})`);
//     }
//   }, [colors, direction]);

//   useEffect(() => {
//     if (colors.length >= 2) {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');
//       const [x0, y0, x1, y1] = getGradientCoords(canvas, direction);
//       const grd = ctx.createLinearGradient(x0, y0, x1, y1);
//       grd.addColorStop(0, rgbToHex(...colors[0]));
//       grd.addColorStop(1, rgbToHex(...colors[1]));
//       ctx.fillStyle = grd;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//     }
//   }, [colors, direction]);

//   const getGradientCoords = (canvas, direction) => {
//     switch (direction) {
//       case 'to right': return [0, 0, canvas.width, 0];
//       case 'to bottom': return [0, 0, 0, canvas.height];
//       case 'to bottom right': return [0, 0, canvas.width, canvas.height];
//       case 'to top right': return [0, canvas.height, canvas.width, 0];
//       default: return [0, 0, canvas.width, 0];
//     }
//   };

//   const downloadImage = () => {
//     const canvas = canvasRef.current;
//     const link = document.createElement('a');
//     link.download = 'gradient-wallpaper.png';
//     link.href = canvas.toDataURL();
//     link.click();
//   };

//   const copyToClipboard = (hex) => {
//     navigator.clipboard.writeText(hex).then(() => {
//       alert(`${hex} copied to clipboard!`);
//     });
//   };

//   return (
//     <Page style={{ background: gradient || (darkMode ? '#111' : '#eee') }} $dark={darkMode}>
//       <ThemeToggle onClick={() => setDarkMode(prev => !prev)}>
//         {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
//       </ThemeToggle>

//       <Title $dark={darkMode}>🎨 Gradient Wallpaper Generator</Title>
//       <Subtitle $dark={darkMode}>Turn your image colors into beautiful gradients</Subtitle>

//       <DropArea {...getRootProps()} $dark={darkMode}>
//         <input {...getInputProps()} />
//         <p>📷 Drag & drop an image here, or click to upload</p>
//       </DropArea>

//       {imageSrc && (
//         <>
//           <ImagePreview>
//             <img
//               ref={imageRef}
//               src={imageSrc}
//               alt="Uploaded"
//               onLoad={handleImageLoad}
//               crossOrigin="anonymous"
//             />
//           </ImagePreview>

//           <Controls>
//             <label>🎯 Gradient Direction:</label>
//             <select value={direction} onChange={(e) => setDirection(e.target.value)}>
//               <option value="to right">Left → Right</option>
//               <option value="to bottom">Top → Bottom</option>
//               <option value="to bottom right">Diagonal ↘</option>
//               <option value="to top right">Diagonal ↗</option>
//             </select>
//             <Button onClick={downloadImage}>⬇️ Download Gradient</Button>
//           </Controls>

//           {colors.length > 0 && (
//             <ColorPalette>
//               <h3>🌈 Extracted Colors:</h3>
//               {colors.map((color, index) => {
//                 const hex = rgbToHex(...color);
//                 return (
//                   <ColorBox key={index}>
//                     <ColorPreview style={{ backgroundColor: hex }} />
//                     <HexCode>
//                       {hex}{' '}
//                       <CopyButton onClick={() => copyToClipboard(hex)}>📋 Copy</CopyButton>
//                     </HexCode>
//                   </ColorBox>
//                 );
//               })}
//             </ColorPalette>
//           )}

//           <canvas ref={canvasRef} width={1920} height={1080} style={{ display: 'none' }} />
//         </>
//       )}
//     </Page>
//   );
// };

// export default App;

// // Styled Components

// const Page = styled.div`
//   height: 100vh;
//   width: 100vw;
//   position: relative;
//   overflow: hidden;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   transition: background 0.5s ease;
// `;

// const ThemeToggle = styled.button`
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   padding: 8px 14px;
//   font-size: 1rem;
//   border: none;
//   border-radius: 8px;
//   background: rgba(0,0,0,0.2);
//   color: white;
//   cursor: pointer;
//   z-index: 999;
//   backdrop-filter: blur(4px);

//   &:hover {
//     background: rgba(0,0,0,0.4);
//   }
// `;

// const Title = styled.h1`
//   font-size: 2.2rem;
//   color: ${({ $dark }) => ($dark ? 'white' : '#111')};
//   text-align: center;
//   margin-bottom: 10px;
// `;

// const Subtitle = styled.p`
//   font-size: 1.1rem;
//   color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)')};
//   text-align: center;
//   margin-bottom: 30px;
// `;

// const DropArea = styled.div`
//   border: 2px dashed ${({ $dark }) => ($dark ? '#999' : '#aaa')};
//   padding: 40px;
//   border-radius: 10px;
//   background: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.7)')};
//   text-align: center;
//   cursor: pointer;
//   font-size: 1.2rem;
// `;

// const ImagePreview = styled.div`
//   margin-top: 20px;
//   img {
//     max-width: 300px;
//     max-height: 300px;
//     border-radius: 10px;
//     box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
//   }
// `;

// const Controls = styled.div`
//   margin-top: 20px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;

//   label {
//     margin-bottom: 5px;
//     font-size: 1rem;
//   }

//   select {
//     padding: 5px 10px;
//     margin-bottom: 10px;
//     font-size: 1rem;
//   }
// `;

// const Button = styled.button`
//   padding: 10px 20px;
//   font-size: 1rem;
//   background: #222;
//   color: white;
//   border: none;
//   border-radius: 6px;
//   cursor: pointer;

//   &:hover {
//     background: #444;
//   }
// `;

// const ColorPalette = styled.div`
//   margin-top: 30px;
//   text-align: center;
// `;

// const ColorBox = styled.div`
//   display: inline-block;
//   margin: 10px;
//   text-align: center;
// `;

// const ColorPreview = styled.div`
//   width: 60px;
//   height: 60px;
//   border-radius: 6px;
//   margin-bottom: 5px;
// `;

// const HexCode = styled.div`
//   font-size: 0.9rem;
//   color: white;
// `;

// const CopyButton = styled.button`
//   margin-left: 6px;
//   font-size: 0.8rem;
//   padding: 2px 6px;
//   border: none;
//   background: #444;
//   color: white;
//   border-radius: 4px;
//   cursor: pointer;

//   &:hover {
//     background: #666;
//   }
// `;







