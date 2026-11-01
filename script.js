const lienzo = document.getElementById("lienzo");
const ctx = lienzo.getContext("2d");
const btnPausa = document.getElementById("btnPausa");
const sliderVel = document.getElementById("velocidad");

const cx = lienzo.width / 2;
const cy = lienzo.height / 2;

let pausado = false;
let velocidad = 1;

// Planetas: radio de órbita, tamaño, color, velocidad angular y ángulo inicial
const planetas = [
  { nombre: "Mercurio", orbita: 70,  radio: 5,  color: "#b0b0b0", vel: 0.045, ang: 0 },
  { nombre: "Venus",    orbita: 105, radio: 8,  color: "#e6b86a", vel: 0.032, ang: 2 },
  { nombre: "Tierra",   orbita: 150, radio: 9,  color: "#2e86de", vel: 0.022, ang: 4 },
  { nombre: "Marte",    orbita: 195, radio: 7,  color: "#d35400", vel: 0.017, ang: 1 }
];

// Estrellas de fondo (posiciones fijas)
const estrellas = [];
for (let i = 0; i < 80; i++) {
  estrellas.push({
    x: Math.random() * lienzo.width,
    y: Math.random() * lienzo.height,
    r: Math.random() * 1.5
  });
}

let angLuna = 0;

function dibujarFondo() {
  ctx.fillStyle = "#05081a";
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  ctx.fillStyle = "#ffffff";
  estrellas.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function dibujarSol() {
  const brillo = ctx.createRadialGradient(cx, cy, 5, cx, cy, 45);
  brillo.addColorStop(0, "#fff59d");
  brillo.addColorStop(1, "#ff9800");
  ctx.fillStyle = brillo;
  ctx.beginPath();
  ctx.arc(cx, cy, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Sol", cx, cy + 55);
}

function dibujarOrbita(radio) {
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radio, 0, Math.PI * 2);
  ctx.stroke();
}

function dibujarPlaneta(p) {
  const x = cx + Math.cos(p.ang) * p.orbita;
  const y = cy + Math.sin(p.ang) * p.orbita;

  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(x, y, p.radio, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(p.nombre, x, y - p.radio - 6);

  // La Luna gira alrededor de la Tierra
  if (p.nombre === "Tierra") {
    const lx = x + Math.cos(angLuna) * 20;
    const ly = y + Math.sin(angLuna) * 20;
    ctx.fillStyle = "#dddddd";
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function dibujarTexto() {
  ctx.fillStyle = "#ffd54f";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Los planetas giran alrededor del Sol por la gravedad", 15, 25);
  ctx.fillStyle = "#cccccc";
  ctx.font = "13px Arial";
  ctx.fillText("Más cerca del Sol = órbita más rápida", 15, 45);
}

function animar() {
  dibujarFondo();
  dibujarSol();
  planetas.forEach(p => {
    dibujarOrbita(p.orbita);
    dibujarPlaneta(p);
    if (!pausado) p.ang += p.vel * velocidad;
  });
  if (!pausado) angLuna += 0.1 * velocidad;
  dibujarTexto();
  requestAnimationFrame(animar);
}

btnPausa.addEventListener("click", () => {
  pausado = !pausado;
  btnPausa.textContent = pausado ? "Reanudar" : "Pausar";
});

sliderVel.addEventListener("input", () => {
  velocidad = parseFloat(sliderVel.value);
});

animar();
