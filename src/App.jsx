import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [modo, setModo] = useState('cesar');
  const [texto, setTexto] = useState('');
  const [textoCifrado, setTextoCifrado] = useState('');
  const [Desifrado, setDesifrado] = useState(false);
  const [alfabeto, setAlfabeto] = useState("abcdefghijklmnñopqrstuvwxyz");
  const [desplazamiento, setDesplazamiento] = useState(3);
  const [infoDescifrado, setInfoDescifrado] = useState(null);

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

  const PATRONES = [
    ...[" de ", " la ", " que ", " el ", " en ", " los ", " las ", " por ",
        " con ", " una ", " para ", " como ", " pero ", " del ", " se ",
        " un ", " su ", " es ", " al ", " lo ", " más ", " sin ", " sobre ",
        " entre ", " cuando ", " no ", " y ", " a "].map((p) => ({ p, peso: 8 })),
    ...["que", "ent", "ado", "con", "est", "par", "los", "nte", "ien",
        "com", "aci", "ión", "cia", "ndo"].map((p) => ({ p, peso: 3 })),
    ...["de", "es", "en", "el", "la", "os", "ra", "ar", "re", "er", "as",
        "on", "al", "an", "ci", "do", "ta", "to", "co", "nt"].map((p) => ({ p, peso: 1 })),
  ];

  function contar(texto, patron) {
    let n = 0;
    let i = texto.indexOf(patron);
    while (i !== -1) {
      n++;
      i = texto.indexOf(patron, i + 1);
    }
    return n;
  }

  function puntuarEspanol(texto) {
    const t = ` ${texto.toLowerCase()} `;
    let puntos = 0;
    for (const { p, peso } of PATRONES) {
      puntos += contar(t, p) * peso;
    }
    return puntos;
  }

  function detectarCifrado(texto, caracteres) {
    const candidatos = [];

    const resAtbash = atbash(texto, caracteres);
    candidatos.push({
      modo: "atbash",
      texto: resAtbash,
      modulo: null,
      puntos: puntuarEspanol(resAtbash),
    });

    for (let shift = 1; shift < caracteres.length; shift++) {
      const resCesar = cesar(texto, caracteres, true, shift);
      candidatos.push({
        modo: "cesar",
        texto: resCesar,
        modulo: shift,
        puntos: puntuarEspanol(resCesar),
      });
    }

    candidatos.sort((a, b) => b.puntos - a.puntos);
    return { ...candidatos[0], candidatos: candidatos.slice(0, 3) };
  }

  useEffect(() => {
    const caracteres = alfabeto.split('');

    if (Desifrado) {
      const resultado = detectarCifrado(texto, caracteres);
      setTextoCifrado(resultado.texto);
      setModo(resultado.modo);
      setInfoDescifrado(resultado);
    } else {
      if (modo === 'cesar') {
        const resultado = cesar(texto, caracteres, false, desplazamiento);
        setTextoCifrado(resultado);
        setInfoDescifrado({ modo: "cesar", texto: resultado, modulo: desplazamiento });
      } else {
        const resultado = atbash(texto, caracteres);
        setTextoCifrado(resultado);
        setInfoDescifrado({ modo: "atbash", texto: resultado, modulo: null });
      }
    }
  }, [texto, modo, Desifrado, alfabeto, desplazamiento]);

  return (
    <>
      <section id="center">
        {/* Selección: ci o dci */}
        <select
          name="cifrado"
          id="cifrado"
          onChange={(v) => setDesifrado(v.target.value === 'decifrar')}
          value={Desifrado ? 'decifrar' : 'cifrar'}
        >
          <option value="cifrar">cifrar</option>
          <option value="decifrar">decifrar</option>
        </select>

        {/* Selección de modo */}
        <select
          name="modo"
          id="modo"
          onChange={(v) => setModo(v.target.value)}
          value={modo}
          disabled={Desifrado}
        >
          <option value="cesar">cesar</option>
          <option value="atbash">atbash</option>
        </select>

        {/* Input ca */}
        <textarea
          value={alfabeto}
          onChange={(v) => setAlfabeto(v.target.value)}
          placeholder="Ingresa el conjunto de caracteres"
        />

        {/* Input ce */}
        <input
          type="number"
          value={desplazamiento}
          onChange={(v) => setDesplazamiento(Number(v.target.value))}
          placeholder="Desplazamiento César"
          disabled={modo !== 'cesar' || Desifrado}
        />

        {/* Texto a ci/dci */}
        <textarea
          value={texto}
          onChange={(v) => setTexto(v.target.value)}
          placeholder="Ingresa el texto"
        />

        {/* Resultado */}
        <h2>Resultado: {textoCifrado}</h2>

        {/* Información  */}
        {infoDescifrado && (
          <div>
            <p>
              Tipo detectado: <strong>{infoDescifrado.modo}</strong>
              {infoDescifrado.modulo !== null && (
                <> · Módulo: <strong>{infoDescifrado.modulo}</strong></>
              )}
              {typeof infoDescifrado.puntos === 'number' && (
                <> · Puntaje: <strong>{infoDescifrado.puntos}</strong></>
              )}
            </p>

            {/* */}
            {infoDescifrado.candidatos && (
              <ol>
                {infoDescifrado.candidatos.map((c, idx) => (
                  <li key={idx}>
                    <strong>{c.modo}</strong>
                    {c.modulo !== null ? ` (módulo ${c.modulo})` : ''}
                    {' '}— puntaje {c.puntos}: <em>{c.texto.slice(0, 40)}</em>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default App;