const canvas = document.querySelector('canvas');

const contexto = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
console.log(canvas);
console.log(contexto);

contexto.fillStyle = 'white';
contexto.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './img/pokemon style game map.png'
console.log(image);

image.onload = () => {
    contexto.drawImage(image, -1000, -600);
}
