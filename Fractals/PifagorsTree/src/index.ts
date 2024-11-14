const STEPS = 3;
const COLOR = 'green';
const ALPHA = Math.PI / 4; // + Math.PI / 2;
const BETA = Math.PI / 5; // ALPHA; // Math.PI / 2 + Math.PI / 4;
const RATIO = 0.8;

class Dot {
    constructor(
        public x: number,
        public y: number,
    ) {}

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();

        return this;
    }
}

class Figure {
    constructor(public dots: Dot[]) {}

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();

        ctx.moveTo(this.dots[0].x, this.dots[0].y);
        for (let i = 1; i < this.dots.length; i++) {
            ctx.lineTo(this.dots[i].x, this.dots[i].y);
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = COLOR;
        ctx.stroke();
    }
}

const element = <HTMLCanvasElement>document.getElementById('example');
const ctx = element.getContext('2d')!;

function drawFractal(angle: number, start: Dot, length: number, steps: number) {
    if (steps <= 0) return;

    length *= RATIO;
    let end1 = new Dot(start.x + Math.sin(ALPHA + angle) * length, start.y - Math.cos(ALPHA + angle) * length);
    let end2 = new Dot(start.x + Math.sin(-BETA + angle) * length, start.y - Math.cos(-BETA + angle) * length);

    new Figure([start, end1]).draw(ctx);
    new Figure([start, end2]).draw(ctx);

    drawFractal(angle + ALPHA, end1, length, steps - 1);
    drawFractal(angle - BETA, end2, length, steps - 1);
}

new Figure([new Dot(500, 600), new Dot(500, 500)]).draw(ctx);

drawFractal(0, new Dot(500, 500), 100, 12);

// for (let i = 0; i < STEPS; i++) {
//     fractal.step();
// }

// let i = 0;
// let int = setInterval(() => {
//     if (i > STEPS) return clearInterval(int);
//     fractal.step();
//     i++;
// }, 200);
