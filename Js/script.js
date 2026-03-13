//© Zero - Código libre no comercial

// Cargar el SVG y animar los corazones
fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // Después de la animación de dibujo, agrandar el SVG
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        // Mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          startFloatingObjects();
          showCountdown();
        }, 1200);
      }, totalDuration);
    }, 50);

    // Selecciona los corazones (formas rojas) y les añade animación de latido
    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

// ── Helpers de URL ──
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// ── Texto de dedicatoria con efecto máquina de escribir ──
function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text = `Para mi vida yurley:\n\n Mi niña hermosa, mi blanquita hermosa, dejame decirte que estoy muy
pero muy feliz por ti aveces se me acaban las palabras para decirte lo mucho que te amo
y lo orgulloso que estoy de ti mi bebita por lo fuerte y capaz que eres aveces siento 
que es mi culpa que mereces alguien mejor pero me doy cuenta de algo y es que
no puedo vivir sin ti.

 Me enamore de ti sin saber que serias mi mundo entero mi razon de vivir
mi fuerza y mi valentia pq en ti encontre lo que nadie mas me dio, 
"amor", aun recuerdo la primera vez que te vi, sentir esas maripositas y esa
sensacion de paz ese sentimiento de conexion que nunca quiero dejar de sentir
pq en verdad mi corazon late mas y mas por ti y nadie ocupara ese lugar que tu 
ya tienes.

Gracias por cada día hermoso que me regalas. Gracias por estar conmigo,
por elegirme, por darme tu amor tan sincero y tan puro.
No sabes cuánto valoro cada palabra tuya, cada risa,
cada momento compartido.

 Tambien quiero pedirte perdon por haberte lastimado por 
darte musho nudos, por hacerte derramar muchas lagrimas
por todo y por que pido perdon? por que eres el amor de mi vida
por que tu sonrisa y tu felicidad es lo mas imporante de mi vida
pq no solo me enamora esa carita esa sonrisa y esos cachetitos 
preciosos me enamora tu voz tu forma de ser tu risa tus 
ocurrencias tu manera de perdonar.
simplemente perdon por todo por lastimarte quiero que sepas
que aveces tambien me quedo sin palabra aveces 
siento que decir te amo es muy poco para todo lo que siento 
pero hoy te digo con la mano en el corazon te amo 
te amo mas de lo que mis palabras dicen
y sobre todo siempre seras el amor de mi vida. 
TE AMO DE AQUI A LA LUNA EN PASITOS DE TORTUGA IDA Y VUELTA. `;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }

  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;

  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// ── Firma manuscrita animada ──
function showSignature() {
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma
    ? decodeURIComponent(firma)
    : "Con todo el amor del mundo Joseph";
  signature.classList.add('visible');
}

// ── Pétalos flotantes ──
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;

  function spawn() {
    const el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left    = `${Math.random() * 90 + 2}%`;
    el.style.top     = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift    = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform  = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity    = 0.2;
    }, 30);

    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, duration + 2000);

    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else              setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

// ── Cuenta regresiva ──
function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let startDate  = startParam
    ? new Date(startParam + 'T00:00:00')
    : new Date('2024-10-14T00:00:00');

  function update() {
    const now  = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    container.innerHTML = `Días juntos: <b>${days}</b> 🤍`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

// ════════════════════════════════════════════════════════
//  MÚSICA – solución al bloqueo de autoplay
//  Los navegadores no permiten reproducir audio sin que
//  el usuario haya interactuado con la página.
//  Estrategia: mostrar un botón atractivo desde el inicio
//  y reproducir en cuanto el usuario lo toque.
// ════════════════════════════════════════════════════════
function setupMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // Fuente personalizada por parámetro URL
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  audio.volume = 0.7;
  audio.loop   = true;

  // Crear botón visible desde el principio
  const btn = document.createElement('button');
  btn.id          = 'music-btn';
  btn.title       = 'Reproducir / Pausar música';
  btn.textContent = '▶️';
  document.body.appendChild(btn);

  let playing = false;

  function startAudio() {
    audio.play()
      .then(() => {
        playing = true;
        btn.textContent = '🔊';
      })
      .catch(err => {
        console.warn('Audio bloqueado por el navegador:', err);
        btn.textContent = '▶️';
      });
  }

  btn.addEventListener('click', () => {
    if (!playing) {
      startAudio();
    } else if (audio.paused) {
      audio.play();
      btn.textContent = '🔊';
    } else {
      audio.pause();
      btn.textContent = '🔈';
    }
  });

  // Intentar autoplay
  audio.play()
    .then(() => {
      playing = true;
      btn.textContent = '🔊';
    })
    .catch(() => { /* el usuario toca el botón */ });
}

// Iniciar al cargar
window.addEventListener('DOMContentLoaded', setupMusic);