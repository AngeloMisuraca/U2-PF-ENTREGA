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
        contexto.save()
        contexto.globalAlpha = this.opacity,
        contexto.drawImage(
            this.image,
            this.frames.value * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.posicion.x,
            this.posicion.y,
            (this.image.width / this.frames.max) * this.scale,
            this.image.height * this.scale
        )
        contexto.restore()

        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 13 === 0) {
            if (this.frames.value < this.frames.max - 1) this.frames.value++
            else this.frames.value = 0
        }
    }

    attack({ attack, recipient }) {
        const timeLine = gsap.timeline()

        this.health -= attack.damage

        let movementDistance = 20
        if (this.isEnemy) {
            movementDistance = -20
        }
        
        let healthBar = '#HP_rival .hp-fill'
        if (this.isEnemy) {
            healthBar = '#HP_jugador .hp-fill'
        }

        timeLine.to(this.posicion, {
            x: this.posicion.x - movementDistance
        }).to(this.posicion, {
            x: this.posicion.x + movementDistance * 2,
            duration: 0.1,
            onComplete: ()=> {

                gsap.to(healthBar, {
                    width: this.health + '%'
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
            x: this.posicion.x
        })
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