import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [modo, setModo] = useState('cesar'); // Modo de cifrado seleccionado
  const [texto, setTexto] = useState(''); // Texto a cifrar/descifrar
  const [textoCifrado, setTextoCifrado] = useState(''); // Resultado
  const [Desifrado, setDesifrado] = useState(false); // Estado: cifrar o descifrar
  const [alfabeto, setAlfabeto] = useState("abcdefghijklmnñopqrstuvwxyz"); // Alfabeto dinámico
  const [desplazamiento, setDesplazamiento] = useState(3); // Desplazamiento configurable

  // Función César
  function cesar(texto, caracteres, descifrar = false, shift = 3) {
    let resultado = [];
    for (const l of texto.toLowerCase()) {
      const indice = caracteres.indexOf(l);
      if (indice > -1) {
        let nuevoIndice = descifrar
          ? (indice - shift + caracteres.length) % caracteres.length
          : (indice + shift) % caracteres.length;
        resultado.push(caracteres[nuevoIndice]);
      } else {
        resultado.push(l);
      }
    }
    return resultado.join('');
  }

  // Función Atbash
  function atbash(texto, caracteres) {
    let resultado = [];
    for (const l of texto.toLowerCase()) {
      const indice = caracteres.indexOf(l);
      if (indice > -1) {
        resultado.push(caracteres[caracteres.length - indice - 1]);
      } else {
        resultado.push(l);
      }
    }
    return resultado.join('');
  }

  // Detección automática en descifrado
  function detectarCifrado(texto, caracteres, shift) {
    const resultadoCesar = cesar(texto, caracteres, true, shift);
    const resultadoAtbash = atbash(texto, caracteres);

    // Heurística simple: elegir el que tenga más vocales
    const contarVocales = (t) => (t.match(/[aeiou]/g) || []).length;

    return contarVocales(resultadoCesar) > contarVocales(resultadoAtbash)
      ? { modo: "cesar", texto: resultadoCesar }
      : { modo: "atbash", texto: resultadoAtbash };
  }

  useEffect(() => {
    const caracteres = alfabeto.split('');

    if (Desifrado) {
      // En descifrado se detecta automáticamente
      const resultado = detectarCifrado(texto, caracteres, desplazamiento);
      setTextoCifrado(resultado.texto);
      setModo(resultado.modo);
    } else {
      // En cifrado se usa el modo seleccionado
      if (modo === 'cesar') {
        setTextoCifrado(cesar(texto, caracteres, false, desplazamiento));
      } else {
        setTextoCifrado(atbash(texto, caracteres));
      }
    }
  }, [texto, modo, Desifrado, alfabeto, desplazamiento]);

  return (
    <>
      <section id="center">
        {/* Selección: cifrar o descifrar */}
        <select
          name="cifrado"
          id="cifrado"
          onChange={(v) => setDesifrado(v.target.value === 'decifrar')}
          value={Desifrado ? 'decifrar' : 'cifrar'}
        >
          <option value="cifrar">cifrar</option>
          <option value="decifrar">decifrar</option>
        </select>

        {/* Selección de modo (solo se usa en cifrado) */}
        <select
          name="modo"
          id="modo"
          onChange={(v) => setModo(v.target.value)}
          value={modo}
          disabled={Desifrado} // En descifrado se detecta automáticamente
        >
          <option value="cesar">cesar</option>
          <option value="atbash">atbash</option>
        </select>

        {/* Input para conjunto de caracteres */}
        <textarea
          value={alfabeto}
          onChange={(v) => setAlfabeto(v.target.value)}
          placeholder="Ingresa el conjunto de caracteres"
        />

        {/* Input para desplazamiento (solo aplica en César) */}
        <input
          type="number"
          value={desplazamiento}
          onChange={(v) => setDesplazamiento(Number(v.target.value))}
          placeholder="Desplazamiento César"
          disabled={modo !== 'cesar'}
        />

        {/* Texto a cifrar/descifrar */}
        <textarea
          value={texto}
          onChange={(v) => setTexto(v.target.value)}
          placeholder="Ingresa el texto"
        />

        {/* Resultado */}
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
