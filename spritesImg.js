let jugador, fondo, foreground, battleBackground, charmander, pikachu;
const renderSprites = [];

function SpriteImages() {
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

    jugador = new Sprite({
        posicion: {
            x: canvas.width / 2 - 256 / 4,
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

    fondo = new Sprite({
        posicion: {
            x: desplazamiento.x,
            y: desplazamiento.y
        },
        image: image
    });

    foreground = new Sprite({
        posicion: {
            x: desplazamiento.x,
            y: desplazamiento.y
        },
        image: foregroundImage
    });

    const battleBackgoundImage = new Image();
    battleBackgoundImage.src = './img/battleBackground.png';

    battleBackground = new Sprite({
        posicion: {
            x: 0,
            y: 0,
        },
        image: battleBackgoundImage,
        scale: 0.8
    });

    const charmanderImage = new Image();
    charmanderImage.src = './img/charmander.png';

    charmander = new Sprite({
        posicion: {
            x: 788,
            y: 140,
        },
        image: charmanderImage,
        frames: {
            max: 5,
        },
        animate: true,
        isEnemy: true,
        name: 'Charmander',
        scale: 2.5
    });

    const pikachuImage = new Image();
    pikachuImage.src = './img/pikachu.png';

    pikachu = new Sprite({
        posicion: {
            x: 380,
            y: 490,
        },
        image: pikachuImage,
        frames: {
            max: 4,
        },
        animate: true,
        name: 'Pikachu',
        scale: -0.5
    });
}