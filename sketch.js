// Número total de granos de cafe
var num = 2222;

// Parámetros para el ruido de Perlin
var noiseScale = 100, noiseStrength = 1;

// Array para almacenar las partículas
var particles = [];

// Velocidades predeterminada y alterada de las partículas
var defaultSpeed = 5;
var alteredSpeed = 20;

// Color de fondo
var bgColor;

// Configuración inicial
function setup() {
  createCanvas(windowWidth, windowHeight); // Crea un lienzo que ocupa toda la ventana del navegador
  bgColor = color(0, 10); // Define el color del fondo (negro con baja opacidad)
  noStroke(); // Desactiva los contornos de las figuras
  for (let i = 0; i < num; i++) {
    var loc = createVector(random(width * 1.2), random(height), 2); // Ubicación inicial aleatoria
    var angle = 0; // Cualquier valor para inicializar el ángulo
    var dir = createVector(cos(angle), sin(angle)); // Dirección inicial
    var speed = random(defaultSpeed, map(mouseX, 0, width, defaultSpeed, alteredSpeed)); // Velocidad inicial
    particles[i] = new Particle(loc, dir, speed); // Crea una nueva partícula y la añade al array
  }
}

// Ajusta el tamaño del lienzo cuando se cambia el tamaño de la ventana del navegador
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Función de dibujo que se ejecuta en cada fotograma
function draw() {
  fill(bgColor); // Rellena con el color de fondo
  rect(0, 0, width, height); // Dibuja el fondo
  var time = millis() % 6000; // Tiempo total del ciclo en milisegundos (2 segundos por color)
  
  // Actualiza y dibuja cada partícula
  for (let i = 0; i < particles.length; i++) {
    particles[i].setColor(time); // Cambia el color de la partícula según el tiempo
    particles[i].run(); // Ejecuta la lógica de la partícula (movimiento, actualización, etc.)
  }
  
  // Limpia el área alrededor del puntero del mouse
  fill(bgColor); // Utiliza el color de fondo para limpiar el área
  ellipse(mouseX, mouseY, 100, 100); // Dibuja un círculo alrededor del puntero del mouse
}

// Clase para representar una partícula
class Particle {
  constructor(_loc, _dir, _speed) {
    this.loc = _loc; // Ubicación de la partícula
    this.dir = _dir; // Dirección de la partícula
    this.speed = _speed; // Velocidad de la partícula
  }

  // Método para establecer el color de la partícula basado en el tiempo
  setColor(time) {
    let col;
    if (time < 2000) { // Primeros 2 segundos: blanco
      col = color(255, 255, 255);
    } else if (time < 4000) { // Siguientes 2 segundos: de blanco a verde
      let t = map(time, 2000, 4000, 0, 1);
      col = lerpColor(color(255, 255, 255), color(0, 255, 0), t);
    } else { // Últimos 2 segundos: de verde a rojo
      let t = map(time, 4000, 6000, 0, 1);
      col = lerpColor(color(0, 255, 0), color(255, 0, 0), t);
    }
    this.col = col; // Asigna el color calculado a la partícula
  }

  // Método para ejecutar la lógica de la partícula
  run() {
    this.move(); // Mueve la partícula
    this.checkEdges(); // Verifica si la partícula ha salido del lienzo
    this.update(); // Actualiza la apariencia de la partícula
  }

  // Método para mover la partícula
  move() {
    // Utiliza el ruido de Perlin para determinar el ángulo de movimiento
    let angle = noise(this.loc.x / noiseScale, this.loc.y / noiseScale, frameCount / noiseScale) * TWO_PI * noiseStrength;
    this.dir.x = sin(angle);
    this.dir.y = tan(angle);
    var vel = this.dir.copy(); // Copia la dirección de la partícula
    var d = 22; // Cambio de dirección
    vel.mult(this.speed * d); // Multiplica la velocidad por el cambio de dirección
    this.loc.add(vel); // Actualiza la ubicación de la partícula

    // Cambia la velocidad según la posición del mouse
    this.speed = map(mouseX, 0, width, defaultSpeed, alteredSpeed);
  }

  // Método para verificar si la partícula ha salido del lienzo
  checkEdges() {
    if (this.loc.x < 0 || this.loc.x > width || this.loc.y < 0 || this.loc.y > height) {
      this.loc.x = random(width * 10); // Reubica la partícula en una posición aleatoria dentro del lienzo
      this.loc.y = random(height);
    }
  }

  // Método para actualizar la apariencia de la partícula
  update() {
    fill(this.col); // Rellena con el color de la partícula
    ellipse(this.loc.x, this.loc.y, this.loc.z); // Dibuja la partícula como un elipse
  }
}
