const btnEmpezar = document.getElementById('btnEmpezar');
const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');
const gameMusic = document.getElementById('game-music');
const startEffect = document.getElementById('start-effect');
const pointerEffect = document.getElementById('pointer-effect');
const loseEffect = document.getElementById('lose-effect');
const winEffect = document.getElementById('win-effect');
const ULTIMO_NIVEL = 2;

class Juego {
    constructor() {
        this.inicializar();
        this.generarSecuencia();
        setTimeout(() => this.siguienteNivel(), 500);
    }

    inicializar() {
        startEffect.play();
        this.elegirColor = this.elegirColor.bind(this);
        this.siguienteNivel = this.siguienteNivel.bind(this);
        btnEmpezar.classList.add('hide');
        this.nivel = 1;
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        }
    }

    // ReStart
    restart() {
        this.eliminarEventosClick();
        btnEmpezar.classList.remove('hide');
        if (gameMusic.paused) {
            gameMusic.play();
        }
    }

    agregarEventosClick() {
        // Obtenemos los indices del objeto this.colores y le asignamos el evento
        Object.keys(this.colores).map((color) => {
            this.colores[color].addEventListener('click', this.elegirColor);
        });
    }
    
    eliminarEventosClick() {
        // Obtenemos los indices del objeto this.colores y le asignamos el evento
        Object.keys(this.colores).map((color) => {
            this.colores[color].removeEventListener('click', this.elegirColor);
        });
    }

    generarSecuencia() {
        this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4));
    }

    siguienteNivel() {
        this.subnivel = 0;
        this.iluminarSecuencia();
        this.agregarEventosClick();
    }

    numeroAColor(numero) {
        switch (numero) {
            case 0:
                return 'celeste';
            case 1:
                return 'violeta';
            case 2:
                return 'naranja';
            case 3:
                return 'verde';
        }
    }

    colorANumero(color) {
        switch (color) {
            case 'celeste':
                return 0;
            case 'violeta':
                return 1;
            case 'naranja':
                return 2;
            case 'verde':
                return 3;
        }
    }

    apagarColor(color) {
        this.colores[color].classList.remove('light');
    }

    iluminarColor(color) {
        this.colores[color].classList.add('light');
        pointerEffect.play();
        setTimeout(() => this.apagarColor(color), 350);
    }

    iluminarSecuencia() {
        // Recorremos el array de generarSecuencia() dependiendo del nivel
        for (let i = 0; i < this.nivel; i++) {
            const color = this.numeroAColor(this.secuencia[i]);
            setTimeout(() => {
                this.iluminarColor(color) 
            }, 1000 * i);;
        }
    }

    ganoElJuego() {
        gameMusic.pause();
        swal('Platzi', 'Felicitaciones ¡Ganaste!','success')
        .then((event) => {
            this.restart();
        })
    }

    perdioElJuego() {
        swal('Platzi', 'Lo siento, perdiste :(', 'error')
            .then((event) => {
                console.log(event)
                this.restart();
            })
    }

    elegirColor(ev) {
        pointerEffect.play();
        const nombreColor = ev.target.dataset.color;
        const numeroColor = this.colorANumero(nombreColor);
        this.iluminarColor(nombreColor);
        if (numeroColor === this.secuencia[this.subnivel]) {
            this.subnivel++;
            if (this.subnivel === this.nivel) {
                this.nivel++
                this.eliminarEventosClick()
                if (this.nivel == (ULTIMO_NIVEL + 1)) {
                    // Ganó
                    this.ganoElJuego();
                    winEffect.play();
                } else {
                    setTimeout(() => this.siguienteNivel(), 2000);
                }
            }
        } else {
            // Perdió
            this.perdioElJuego();
            loseEffect.play();
            gameMusic.pause();
        }
    }
}


function empezarJuego() {
    let juego = new Juego();
    window.juego =  juego;
}

function music(action) {
    switch (action) {
        case 'play':
            gameMusic.play();
            break;
        case 'stop':
            gameMusic.pause();
            break;
    }
}