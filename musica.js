const musicaCiudad = new Audio('./audio/citySound.mp3');
musicaCiudad.loop = true;
musicaCiudad.volume = 0.4;

const musicaBatalla = new Audio('./audio/battleSound.mp3');
musicaBatalla.loop = true;
musicaBatalla.volume = 0.4;

const sfx = {
    click: new Audio('./audio/clickSound.mp3'),
    rayo: new Audio('./audio/thunderSound.mp3'),
    golpe: new Audio('./audio/hitSound.mp3')
};

let audioIniciado = false;

window.addEventListener('keydown', (e) => {
    if (!audioIniciado &&
        (e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        musicaCiudad.play();
        audioIniciado = true;
    }
});

document.querySelectorAll('.footer button').forEach(button => {
    button.addEventListener('click', () => {
        sfx.click.currentTime = 0;
        sfx.click.play();
    });
});