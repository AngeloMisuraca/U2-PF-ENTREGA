class Sprite {
    constructor({ posicion, image, frames = { max: 1 }, sprites, animate = false, isEnemy = false, scale = 1 }) {
        this.posicion = posicion;
        this.image = image;
        this.scale = scale;
        this.frames = { ...frames, value: 0, elapsed: 0 };

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.health = 100;
        this.isEnemy = isEnemy
    }

    draw() {
        if (!this.width) return;

        const columnasTrueno = 5;
        let col = 0;
        let fila = 0;

        if (this.frames.max > columnasTrueno) {
            col = this.frames.value % columnasTrueno;
            fila = Math.floor(this.frames.value / columnasTrueno);
        } else {
            col = this.frames.value;
            fila = 0;
        }

        contexto.save();
        contexto.globalAlpha = this.opacity;

        contexto.drawImage(
            this.image,
            col * this.width,
            fila * this.height,
            this.width,
            this.height,
            this.posicion.x,
            this.posicion.y,
            this.width * this.scale,
            this.height * this.scale
        );
        contexto.restore();

        if (!this.animate) return;

        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }

        const velocidad = this.frames.hold || 13;

        if (this.frames.elapsed % velocidad === 0) {
            if (this.frames.value < this.frames.max - 1) this.frames.value++;
            else this.frames.value = 0;
        }
    }

    attack({ attack, recipient, renderSprites }) {

        const timeLine = gsap.timeline();

        // CORRECCIÓN: El daño lo recibe el oponente
        recipient.health -= attack.damage;
        if (recipient.health < 0) recipient.health = 0;

        // Determinar qué barra de vida animar
        let healthBar;
        if (this.isEnemy) {
            healthBar = '#HP_jugador .hp-fill';
        } else {
            healthBar = '#HP_rival .hp-fill';
        }

        // Dirección del movimiento físico del Pokémon
        let movementDistance;
        if (this.isEnemy) {
            movementDistance = -20;
        } else {
            movementDistance = 20;
        }

        const alTerminarAtaque = () => {
            // Si el que atacó fue Pikachu (el jugador), Charmander responde
            if (!this.isEnemy) {

                // --- AQUÍ LLAMAS A TUS ATAQUES DE CHARMANDER ---
                const nombresAtaques = Object.keys(ataquesCharmander); // Usa tu objeto
                const nombreAleatorio = nombresAtaques[Math.floor(Math.random() * nombresAtaques.length)];
                const ataqueSeleccionado = ataquesCharmander[nombreAleatorio];

                // Pequeño delay para que no sea instantáneo
                setTimeout(() => {
                    recipient.attack({
                        attack: ataqueSeleccionado,
                        recipient: this,
                        renderSprites,
                    });
                }, 800);
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
                    frames: {
                        max: 10,
                        hold: 5
                    },
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
                    duration: 1,
                    onComplete: () => {
                        renderSprites.splice(renderSprites.indexOf(voltio), 1);
                    }
                });

                timeLine.to(this.posicion, {
                    x: this.posicion.x - movementDistance
                }).to(this.posicion, {
                    x: this.posicion.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {

                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        });

                        gsap.to(recipient.posicion, {
                            x: recipient.posicion.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: 0.09,
                        });

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 3,
                            yoyo: true,
                            duration: 0.09
                        });
                    }
                }).to(this.posicion, {
                    x: this.posicion.x,
                    onComplete: alTerminarAtaque
                });
                break;

            case 'AtaqueRapido':
                const quickAttackImage = new Image();

                const QuickAttack = new Sprite({
                    posicion: {
                        x: recipient.posicion.x - 50,
                        y: recipient.posicion.y - 30
                    },
                    image: quickAttackImage,
                    frames: {
                        max: 10,
                        hold: 5
                    },
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
                    duration: 1,
                    onComplete: () => {
                        renderSprites.splice(renderSprites.indexOf(QuickAttack), 1);
                    }
                });

                timeLine.to(this.posicion, {
                    x: this.posicion.x - movementDistance,
                    duration: 0.05
                }).to(this.posicion, {
                    x: this.posicion.x + movementDistance * 2,
                    duration: 0.05,
                    onComplete: () => {

                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        });

                        gsap.to(recipient.posicion, {
                            x: recipient.posicion.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: 0.09,
                        });

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 3,
                            yoyo: true,
                            duration: 0.09
                        });
                    }
                }).to(this.posicion, {
                    x: this.posicion.x,
                    onComplete: alTerminarAtaque
                });
                break;

            case 'Trueno':

                const truenoImage = new Image();

                const trueno = new Sprite({
                    posicion: {
                        x: recipient.posicion.x - 130,
                        y: recipient.posicion.y - 190
                    },
                    image: truenoImage,
                    frames: {
                        max: 10,
                        hold: 5
                    },
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
                    duration: 1,
                    onComplete: () => {
                        renderSprites.splice(renderSprites.indexOf(trueno), 1);
                    }
                });

                timeLine.to(this.posicion, {
                    x: this.posicion.x - movementDistance
                }).to(this.posicion, {
                    x: this.posicion.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {

                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        });

                        gsap.to(recipient.posicion, {
                            x: recipient.posicion.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: 0.09,
                        });

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 3,
                            yoyo: true,
                            duration: 0.09
                        });
                    }
                }).to(this.posicion, {
                    x: this.posicion.x,
                    onComplete: alTerminarAtaque
                });
                break;

            case 'Tackle':

                timeLine.to(this.posicion, {
                    x: this.posicion.x - movementDistance
                }).to(this.posicion, {
                    x: this.posicion.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {

                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })

                        gsap.to(recipient.posicion, {
                            x: recipient.posicion.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: 0.09,
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 3,
                            yoyo: true,
                            duration: 0.09
                        })
                    }
                }).to(this.posicion, {
                    x: this.posicion.x,
                    onComplete: alTerminarAtaque
                })
                break;

            case 'flames':
                const imgFlames = new Image();

                // 1. PRIMERO declaramos qué hacer al cargar


                // 2. DESPUÉS le damos la ruta de la imagen


                const Flames = new Sprite({
                    posicion: {
                        x: recipient.posicion.x - 50,
                        y: recipient.posicion.y - 100
                    },
                    image: imgFlames,
                    frames: {
                        max: 3,
                        hold: 5
                    },
                    animate: true,
                    scale: 1
                });

                imgFlames.onload = () => {
                    Flames.width = imgFlames.width / 5;
                    // efectoFlames.height = imgFlames.height / 2;
                };

                imgFlames.src = './img/Flames.png';
                renderSprites.push(Flames);

                gsap.to(Flames.posicion, {
                    duration: 1,
                    onComplete: () => {
                        renderSprites.splice(renderSprites.indexOf(Flames), 1);
                    }
                });

                timeLine.to(this.posicion, {
                    x: this.posicion.x - movementDistance
                }).to(this.posicion, {
                    x: this.posicion.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(healthBar, { width: recipient.health + '%' });
                        gsap.to(recipient.posicion, { x: recipient.posicion.x + 10, yoyo: true, repeat: 3, duration: 0.08 });
                        gsap.to(recipient, { opacity: 0, repeat: 3, yoyo: true, duration: 0.08 });
                    }
                }).to(this.posicion, {
                    x: this.posicion.x,
                    onComplete: alTerminarAtaque
                });
                break;

            case 'fireSpin':
                const imgFireSpin = new Image();

                const FireSpin = new Sprite({
                    posicion: {
                        x: recipient.posicion.x - 30,
                        y: recipient.posicion.y - 80
                    },
                    image: imgFireSpin,
                    frames: {
                        max: 8,
                        hold: 5
                    },
                    animate: true,
                    scale: 1
                });

                imgFireSpin.onload = () => {
                    FireSpin.width = imgFireSpin.width / 5;
                    FireSpin.height = imgFireSpin.height;
                };
                imgFireSpin.src = './img/FireSpin.png';
                renderSprites.push(FireSpin);

                gsap.to(FireSpin.posicion, {
                    duration: 1,
                    onComplete: () => {
                        renderSprites.splice(renderSprites.indexOf(FireSpin), 1);
                    }
                });

                timeLine.to(this.posicion, {
                    x: this.posicion.x - movementDistance
                }).to(this.posicion, {
                    x: this.posicion.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(healthBar, { width: recipient.health + '%' });
                        gsap.to(recipient.posicion, { x: recipient.posicion.x + 10, yoyo: true, repeat: 3, duration: 0.08 });
                        gsap.to(recipient, { opacity: 0, repeat: 3, yoyo: true, duration: 0.08 });
                    }
                }).to(this.posicion, {
                    x: this.posicion.x,
                    onComplete: alTerminarAtaque
                });
                break;
        }

    }
}

class Limite {
    static width = 48
    static height = 48

    constructor({ posicion }) {
        this.posicion = posicion;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        contexto.fillStyle = 'rgba(255, 0, 0, 0)'
        contexto.fillRect(this.posicion.x, this.posicion.y, this.width, this.height)
    }
}