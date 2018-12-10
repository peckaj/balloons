const maxRandom = maxSize => Math.floor(Math.random() * Math.floor(maxSize));

class Balloons {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        this.balloonsNum = this.width/10;
        this.minSize = 30;
        this.maxSize = 80;
        this.balloons = [];
        this.mousePosition = {x: 0, y: 0};

        this.start = this.start.bind(this);
        this.createBalloons();
        this.addEvents();
    }

    start() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.balloons.forEach(balloon => {
            balloon.enlarge = this.isIntersect(this.mousePosition, balloon) ? -1 : 1;
            balloon.animate();
        });
        requestAnimationFrame(this.start);
    }

    createBalloons() {
        for (let i = 0; i < this.balloonsNum; i++) {
            let randSize = maxRandom(this.maxSize);
            let size = randSize > this.minSize ? randSize : this.minSize;

            let randX = maxRandom(this.width - size);
            let randY = maxRandom(this.height - size);
            let x = randX < size ? size : randX;
            let y = randY < size ? size : randY;
            this.balloons.push(new Balloon(x, y, size, this));
        }
    }

    isIntersect(point, circle) {
        return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < this.width/7;
    }

    addEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePosition = {x: e.clientX, y: e.clientY};
        });
    }
}

class Balloon {
    constructor(x, y, size, balloons) {
        this.x = x;
        this.y = y;
        this.originSize = size;
        this.size = size;
        this.enlarge = 0;
        this.ctx = balloons.ctx;
        this.balloons = balloons;
        this.color = 'rgba(' + maxRandom(255) + ',' + maxRandom(255) + ',' + maxRandom(255) + ',1)';
        this.speed = maxRandom(10) || 3;
        this.direction = [Math.random() * (Math.round(Math.random()) * 2 - 1) * this.speed, Math.random() * (Math.round(Math.random()) * 2 - 1) * this.speed];
    }

    animate() {
        this.x = this.x + this.direction[0];
        this.y = this.y + this.direction[1];

        if (this.x + this.size > this.balloons.width || this.x - this.size < 0) {
            this.direction[0] *= -1;
            this.x = this.x + this.direction[0];
        }
        if (this.y + this.size > this.balloons.height || this.y - this.size < 0) {
            this.direction[1] *= -1;
            this.y = this.y + this.direction[1];
        }


        if (this.enlarge < 0 && this.size > 0) {
            this.size -= this.size / 10;
        }

        if (this.enlarge > 0 && this.size < this.originSize) {
            this.size += this.size / 20;
        }

        if (this.size > 0) {
            this.draw();
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        this.ctx.closePath();
        this.ctx.fillStyle = this.color;
        this.ctx.fill();


    }
}

////////////////////////////////////////////////////////////////////

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let balloons = new Balloons(canvas);
balloons.start();