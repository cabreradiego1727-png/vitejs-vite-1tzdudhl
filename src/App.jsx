import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [modo, setModo] = useState('cesar');
  const [texto, setTexto] = useState('');
  const [textoCifrado, setTextoCifrado] = useState('');
  const [Desifrado, setDesifrado] = useState(false);

  useEffect(() => {
    console.log(modo, texto);

    let letras = texto.split('').map((l) => l.toLowerCase());
    let resultado = [];

    // CLAVE DEL CESAR
    const desplazamiento = 3;

    // =========================
    // ATBASH
    // =========================
    if (modo === 'Atbash') {
      for (const l of letras) {
        const indice = alfabeto.indexOf(l);

        if (indice > -1) {
          // Atbash funciona igual para cifrar y descifrar
          resultado.push(alfabeto[alfabeto.length - indice - 1]);
        } else {
          resultado.push(l);
        }
      }
    }

    // =========================
    // CESAR
    // =========================
    if (modo === 'cesar') {
      for (const l of letras) {
        const indice = alfabeto.indexOf(l);

        if (indice > -1) {
          let nuevoIndice;

          // DESCIFRAR
          if (Desifrado) {
            nuevoIndice =
              (indice - desplazamiento + alfabeto.length) % alfabeto.length;
          }
          // CIFRAR
          else {
            nuevoIndice = (indice + desplazamiento) % alfabeto.length;
          }

          resultado.push(alfabeto[nuevoIndice]);
        } else {
          resultado.push(l);
        }
      }
    }

    setTextoCifrado(resultado.join(''));
  }, [texto, modo, Desifrado]);

  return (
    <>
      <section id="center">
        {/* CIFRAR O DESCIFRAR */}
        <select
          name="cifrado"
          id="cifrado"
          onChange={(v) => {
            setDesifrado(v.target.value === 'decifrar');
          }}
          value={Desifrado ? 'decifrar' : 'cifrar'}
        >
          <option value="cifrar">cifrar</option>
          <option value="decifrar">decifrar</option>
        </select>

        {/* MODO */}
        <select
          name="modo"
          id="modo"
          onChange={(v) => {
            setModo(v.target.value);
          }}
          value={modo}
        >
          <option value="cesar">cesar</option>
          <option value="Atbash">Atbash</option>
        </select>

        {/* TEXTO */}
        <textarea value={texto} onChange={(v) => setTexto(v.target.value)} />

        {/* RESULTADO */}
        <h2>{textoCifrado}</h2>
      </section>
    </>
  );
}

export default App;

const alfabeto = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'ñ',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
