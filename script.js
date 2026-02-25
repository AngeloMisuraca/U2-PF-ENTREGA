const canvas = document.querySelector('canvas');

const contexto = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 595;

const collisionMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionMap.push(collisions.slice(i, 70 + i));
}
const desplazamiento = {
    x: -600,
    y: -500
}

const limites = [];

// for (let i = 0; i < collisionMap.length; i++) {
//     const row = collisionMap[i];
//     for (let j = 0; j < row.length; j++) {
//         const simbolo = row[j];
//         if (simbolo === 1025) {
//             limites.push(new limite({
//                 posicion: {
//                     x: i * limite.width + desplazamiento.x,
//                     y: i * limite.height + desplazamiento.y,
//                 }
//             }));
//         }
//     }
// }

collisionMap.forEach((row, i) => {
    row.forEach((simbolo, j) => {
        if (simbolo === 1025) {
            limites.push(new Limite({
                posicion: {
                    x: j * Limite.width + desplazamiento.x,
                    y: i * Limite.height + desplazamiento.y,
                }
            }))
        }
    })
})

const image = new Image();
image.src = './img/pokemon style game map.png'

const foregroundImage = new Image();
foregroundImage.src = './img/foreground.png'

const playerImgUp = new Image();
playerImgUp.src = './img/MaximoUp.png'

const playerImgDown = new Image();
playerImgDown.src = './img/MaximoDown.png'

const playerImgLeft = new Image();
playerImgLeft.src = './img/MaximoLeft.png'

const playerImgRigth = new Image();
playerImgRigth.src = './img/MaximoRigth.png'


const jugador = new Sprite({
    posicion: {
        x: canvas.width / 2 - 256 / 4 / 2,
        y: canvas.height / 2 - 56 / 2,
    },
    image: playerImgDown,
    frames: {
        max: 4
    },
    sprites: {
        arriba: playerImgUp,
        abajo: playerImgDown,
        izquierda: playerImgLeft,
        derecha: playerImgRigth,
    }
})

const fondo = new Sprite({
    posicion: {
        x: desplazamiento.x,
        y: desplazamiento.y
    },
    image: image
});

const foreground = new Sprite({
    posicion: {
        x: desplazamiento.x,
        y: desplazamiento.y
    },
    image: foregroundImage
});

const keys = {
    ArrowUp: {
        presionada: false
    },
    ArrowLeft: {
        presionada: false
    },
    ArrowDown: {
        presionada: false
    },
    ArrowRight: {
        presionada: false
    }
}

let ultimaKey = "";

const simboloMovible = [fondo, ...limites, foreground]

function colisionRectangular({ rectangulo1, rectangulo2 }) {
    return (
        rectangulo1.posicion.x + rectangulo1.width >= rectangulo2.posicion.x && rectangulo1.posicion.x <= rectangulo2.posicion.x + rectangulo2.width && rectangulo1.posicion.y <= rectangulo2.posicion.y + rectangulo2.height && rectangulo1.posicion.y + rectangulo1.height >= rectangulo2.posicion.y
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    fondo.draw();
    limites.forEach(limite => {
        limite.draw()
    })
    jugador.draw();
    foreground.draw()

    let moving = true;
    jugador.moving = false
    if (keys.ArrowUp.presionada && ultimaKey === "ArrowUp") {
        jugador.moving = true
        jugador.image = jugador.sprites.arriba

        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (
                colisionRectangular({
                    rectangulo1: jugador,
                    rectangulo2: {
                        ...limite,
                        posicion: {
                            x: limite.posicion.x,
                            y: limite.posicion.y + 3
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving) {
            simboloMovible.forEach(Movibles => {
                Movibles.posicion.y += 3
            })
        }


    }
    else if (keys.ArrowDown.presionada && ultimaKey == "ArrowDown") {
        jugador.moving = true
        jugador.image = jugador.sprites.abajo
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (
                colisionRectangular({
                    rectangulo1: jugador,
                    rectangulo2: {
                        ...limite,
                        posicion: {
                            x: limite.posicion.x,
                            y: limite.posicion.y - 3
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving)
            simboloMovible.forEach(Movibles => {
                Movibles.posicion.y -= 3
            })
    }
    else if (keys.ArrowLeft.presionada && ultimaKey == "ArrowLeft") {
        jugador.moving = true
        jugador.image = jugador.sprites.izquierda
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (
                colisionRectangular({
                    rectangulo1: jugador,
                    rectangulo2: {
                        ...limite,
                        posicion: {
                            x: limite.posicion.x + 3,
                            y: limite.posicion.y
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving)
            simboloMovible.forEach(Movibles => {
                Movibles.posicion.x += 3
            })
    }
    else if (keys.ArrowRight.presionada && ultimaKey == "ArrowRight") {
        jugador.moving = true
        jugador.image = jugador.sprites.derecha
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (
                colisionRectangular({
                    rectangulo1: jugador,
                    rectangulo2: {
                        ...limite,
                        posicion: {
                            x: limite.posicion.x - 3,
                            y: limite.posicion.y
                        }
                    }
                })
            ) {
                moving = false;
                break;
            }
        }
        if (moving)
            simboloMovible.forEach(Movibles => {
                Movibles.posicion.x -= 3
            })
    }
}

animate();



window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.presionada = true;
            ultimaKey = "ArrowUp"
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.presionada = true;
            ultimaKey = "ArrowLeft"
            break;
        case 'ArrowDown':
            keys.ArrowDown.presionada = true;
            ultimaKey = "ArrowDown"
            break;
        case 'ArrowRight':
            keys.ArrowRight.presionada = true;
            ultimaKey = "ArrowRight"
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.presionada = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.presionada = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown.presionada = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.presionada = false;
            break;
    }
})
