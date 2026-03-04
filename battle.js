let battleAnimationID;

function animateBattle() {
    battleAnimationID = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    charmander.draw();
    pikachu.draw();

    renderSprites.forEach((Sprite) => {
        Sprite.draw();
    });
}

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
        if (!battleActivo.initiated) return;

        const attackKey = e.currentTarget.innerHTML.trim();
        const selectedattack = tackles[attackKey];

        if (selectedattack) {
            pikachu.attack({
                attack: selectedattack,
                recipient: charmander,
                renderSprites,
            });
        }

        if (charmander.health <= 0) {
            charmander.faint();
        }

        if (pikachu.health <= 0) {
            pikachu.faint();
        }
    });
});

function attack(attacker, { attack, recipient, renderSprites }) {
    document.querySelector('#dialogoBox').style.display = 'block'
    document.querySelector('#dialogoBox').innerHTML = attacker.name + ' usó ' + attack.name;
    const timeLine = gsap.timeline();

    if (attack.name === 'Trueno' || attack.name === 'Tacleada_de_Voltios') {
        sfx.rayo.currentTime = 0;
        sfx.rayo.play();
    } else {
        sfx.golpe.currentTime = 0;
        sfx.golpe.play();
    }

    setTimeout(() => {
        sfx.rayo.pause();
        sfx.rayo.currentTime = 0;
    }, 1000);

    let healthBar;
    if (attacker.isEnemy) {
        healthBar = '#HP_jugador .hp-fill';
    } else {
        healthBar = '#HP_rival .hp-fill';
    }

    let movementDistance;
    if (attacker.isEnemy) {
        movementDistance = -20;
    } else {
        movementDistance = 20;
    }

    const alTerminarAtaque = () => {
        if (!attacker.isEnemy && recipient.health > 0) {
            const nombresAtaques = Object.keys(ataquesCharmander);
            const nombreAleatorio = nombresAtaques[Math.floor(Math.random() * nombresAtaques.length)];
            const ataqueSeleccionado = ataquesCharmander[nombreAleatorio];

            setTimeout(() => {
                recipient.attack({
                    attack: ataqueSeleccionado,
                    recipient: attacker,
                    renderSprites,
                });
            }, 600);
        }
    };

    switch (attack.name) {
        case 'Tacleada_de_Voltios':
            const voltioImage = new Image();
            const voltio = new Sprite({
                posicion: {
                    x: recipient.posicion.x - 35,
                    y: recipient.posicion.y - 20
                },
                image: voltioImage,
                frames: { max: 10, hold: 5 },
                animate: true,
                scale: 1.5
            });
            voltioImage.onload = () => {
                voltio.width = voltioImage.width / 5;
                voltio.height = voltioImage.height / 2;
            };
            voltioImage.src = './img/voltio.png';
            renderSprites.push(voltio);
            gsap.to(voltio.posicion, {
                duration: 0.6,
                onComplete: () => renderSprites.splice(renderSprites.indexOf(voltio), 1)
            });
            timeLine.to(attacker.posicion, { x: attacker.posicion.x - movementDistance, duration: 0.1 })
                .to(attacker.posicion, {
                    x: attacker.posicion.x + movementDistance * 2,
                    duration: 0.05,
                    onComplete: () => {
                        const sigueVivo = attacker.applyDamage(recipient, attack, healthBar);
                        if (!sigueVivo) return;
                        gsap.to(recipient.posicion, { x: recipient.posicion.x + 10, yoyo: true, repeat: 3, duration: 0.06 });
                        gsap.to(recipient, { opacity: 0, repeat: 3, yoyo: true, duration: 0.06 });
                    }
                })
                .to(attacker.posicion, { x: attacker.posicion.x, duration: 0.1, onComplete: alTerminarAtaque });
            break;

        case 'AtaqueRapido':
            const quickAttackImage = new Image();
            const QuickAttack = new Sprite({
                posicion: { x: recipient.posicion.x - 50, y: recipient.posicion.y - 30 },
                image: quickAttackImage,
                frames: { max: 10, hold: 5 },
                animate: true,
                scale: 1.5
            });
            quickAttackImage.onload = () => {
                QuickAttack.width = quickAttackImage.width / 5;
                QuickAttack.height = quickAttackImage.height / 2;
            };
            quickAttackImage.src = './img/ataqueRapido.png';
            renderSprites.push(QuickAttack);
            gsap.to(QuickAttack.posicion, {
                duration: 0.6,
                onComplete: () => renderSprites.splice(renderSprites.indexOf(QuickAttack), 1)
            });
            timeLine.to(attacker.posicion, { x: attacker.posicion.x - movementDistance, duration: 0.04 })
                .to(attacker.posicion, {
                    x: attacker.posicion.x + movementDistance * 2,
                    duration: 0.04,
                    onComplete: () => {
                        const sigueVivo = attacker.applyDamage(recipient, attack, healthBar);
                        if (!sigueVivo) return;
                        gsap.to(recipient.posicion, { x: recipient.posicion.x + 10, yoyo: true, repeat: 3, duration: 0.06 });
                        gsap.to(recipient, { opacity: 0, repeat: 3, yoyo: true, duration: 0.06 });
                    }
                })
                .to(attacker.posicion, { x: attacker.posicion.x, duration: 0.04, onComplete: alTerminarAtaque });
            break;

        case 'Trueno':
            const truenoImage = new Image();
            const trueno = new Sprite({
                posicion: { x: recipient.posicion.x - 130, y: recipient.posicion.y - 190 },
                image: truenoImage,
                frames: { max: 10, hold: 5 },
                animate: true,
                scale: 3.5
            });
            truenoImage.onload = () => {
                trueno.width = truenoImage.width / 5;
                trueno.height = truenoImage.height / 2;
            };
            truenoImage.src = './img/trueno.png';
            renderSprites.push(trueno);
            gsap.to(trueno.posicion, {
                duration: 0.7 ,
                onComplete: () => renderSprites.splice(renderSprites.indexOf(trueno), 1)
            });
            timeLine.to(attacker.posicion, { x: attacker.posicion.x - movementDistance, duration: 0.1 })
                .to(attacker.posicion, {
                    x: attacker.posicion.x + movementDistance * 2,
                    duration: 0.05,
                    onComplete: () => {
                        const sigueVivo = attacker.applyDamage(recipient, attack, healthBar);
                        if (!sigueVivo) return;
                        gsap.to(recipient.posicion, { x: recipient.posicion.x + 10, yoyo: true, repeat: 3, duration: 0.06 });
                        gsap.to(recipient, { opacity: 0, repeat: 3, yoyo: true, duration: 0.06 });
                    }
                })
                .to(attacker.posicion, { x: attacker.posicion.x, duration: 0.1, onComplete: alTerminarAtaque });
            break;

        case 'Tackle':
            timeLine.to(attacker.posicion, { x: attacker.posicion.x - movementDistance, duration: 0.1 })
                .to(attacker.posicion, {
                    x: attacker.posicion.x + movementDistance * 2,
                    duration: 0.05,
                    onComplete: () => {
                        const sigueVivo = attacker.applyDamage(recipient, attack, healthBar);
                        if (!sigueVivo) return;
                        gsap.to(recipient.posicion, { x: recipient.posicion.x + 10, yoyo: true, repeat: 3, duration: 0.06 });
                        gsap.to(recipient, { opacity: 0, repeat: 3, yoyo: true, duration: 0.06 });
                    }
                })
                .to(attacker.posicion, { x: attacker.posicion.x, duration: 0.1, onComplete: alTerminarAtaque });
            break;

        case 'cuchillada':
            timeLine.to(attacker.posicion, { x: attacker.posicion.x - movementDistance, duration: 0.1 })
                .to(attacker.posicion, {
                    x: attacker.posicion.x + movementDistance * 2,
                    duration: 0.05,
                    onComplete: () => {
                        const sigueVivo = attacker.applyDamage(recipient, attack, healthBar);
                        if (!sigueVivo) return;
                        gsap.to(recipient.posicion, { x: recipient.posicion.x + 10, yoyo: true, repeat: 3, duration: 0.06 });
                        gsap.to(recipient, { opacity: 0, repeat: 3, yoyo: true, duration: 0.06 });
                    }
                })
                .to(attacker.posicion, { x: attacker.posicion.x, duration: 0.1, onComplete: alTerminarAtaque });
            break;
    }
}

const battleActivo = { initiated: false }
let battleCooldown = false;

document.querySelector('#dialogoBox').addEventListener('click', (event) => {
    event.currentTarget.style.display = 'none';
})

function finalizarCombate() {
    window.cancelAnimationFrame(battleAnimationID);
    musicaBatalla.pause();
    musicaCiudad.play();
    document.querySelector('.battle-ui').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    document.querySelector('#dialogoBox').style.display = 'none';
    battleActivo.initiated = false;
    animate();
}

document.querySelector('.battle-ui').style.display = 'none';
document.querySelector('.footer').style.display = 'none';
document.querySelector('#dialogoBox').style.display = 'none';