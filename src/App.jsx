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

  // ─── Cifradores ──────────────────────────────────────────────────────
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

  // ─── Scoring "¿parece español?" ──────────────────────────────────────
  // Cada patrón aporta evidencia según lo distintivo que sea:
  //   palabras completas (entre espacios) -> evidencia fuerte
  //   trigramas frecuentes                -> evidencia media
  //   bigramas frecuentes                 -> evidencia ligera
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

  // Cuenta ocurrencias permitiendo que dos palabras compartan el espacio
  // intermedio (por eso avanzamos i + 1 y no i + patron.length).
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
    // Espacios al inicio/fin para poder detectar la primera y última palabra.
    const t = ` ${texto.toLowerCase()} `;
    let puntos = 0;
    for (const { p, peso } of PATRONES) {
      puntos += contar(t, p) * peso;
    }
    return puntos;
  }

  // ─── Detección automática ────────────────────────────────────────────
  function detectarCifrado(texto, caracteres) {
    const candidatos = [];

    // 1) Atbash: un único candidato (no tiene "módulo")
    const resAtbash = atbash(texto, caracteres);
    candidatos.push({
      modo: "atbash",
      texto: resAtbash,
      modulo: null,
      puntos: puntuarEspanol(resAtbash),
    });

    // 2) César: probar todos los desplazamientos posibles del alfabeto
    for (let shift = 1; shift < caracteres.length; shift++) {
      const resCesar = cesar(texto, caracteres, true, shift);
      candidatos.push({
        modo: "cesar",
        texto: resCesar,
        modulo: shift,
        puntos: puntuarEspanol(resCesar),
      });
    }

    // El candidato con más evidencia de español gana
    candidatos.sort((a, b) => b.puntos - a.puntos);
    return { ...candidatos[0], candidatos: candidatos.slice(0, 3) };
  }

  useEffect(() => {
    const caracteres = alfabeto.split('');

    if (Desifrado) {
      // En descifrado se detecta automáticamente
      const resultado = detectarCifrado(texto, caracteres);
      setTextoCifrado(resultado.texto);
      setModo(resultado.modo);
      setInfoDescifrado(resultado);
    } else {
      // En cifrado se usa el modo seleccionado
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
          disabled={Desifrado}
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
          disabled={modo !== 'cesar' || Desifrado}
        />

        {/* Texto a cifrar/descifrar */}
        <textarea
          value={texto}
          onChange={(v) => setTexto(v.target.value)}
          placeholder="Ingresa el texto"
        />

        {/* Resultado */}
        <h2>Resultado: {textoCifrado}</h2>

        {/* Información adicional */}
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

            {/* Top 3 candidatos (solo en modo descifrar) para ver qué tan
                seguro estuvo el resultado frente al segundo lugar */}
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