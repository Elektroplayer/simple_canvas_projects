type Dot = { x: number; y: number };

class Figure {
    centralDots: Dot[] = [];

    constructor(public dots: Dot[]) {
        for (let i = 0; i < dots.length - 1; i++) {
            this.centralDots.push({ x: (dots[i].x + dots[i + 1].x) / 2, y: (dots[i].y + dots[i + 1].y) / 2 });
        }
        this.centralDots.push({ x: (dots[0].x + dots[dots.length - 1].x) / 2, y: (dots[0].y + dots[dots.length - 1].y) / 2 });
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();

        ctx.moveTo(this.dots[0].x, this.dots[0].y);
        for (let i = 1; i < this.dots.length; i++) {
            ctx.lineTo(this.dots[i].x, this.dots[i].y);
        }

        ctx.fill();
    }

    drawBlack(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();

        ctx.moveTo(this.centralDots[0].x, this.centralDots[0].y);
        for (let i = 1; i < this.centralDots.length; i++) {
            ctx.lineTo(this.centralDots[i].x, this.centralDots[i].y);
        }

        ctx.fill();
    }

    getNewFigures(): Figure[] {
        return [
            new Figure([this.dots[0], this.centralDots[0], this.centralDots[2]]),
            new Figure([this.dots[1], this.centralDots[0], this.centralDots[1]]),
            new Figure([this.dots[2], this.centralDots[1], this.centralDots[2]]),
        ];
    }
}

class Fractal {
    element = <HTMLCanvasElement>document.getElementById('example');
    ctx = this.element.getContext('2d')!;

    figures: Figure[] = [];

    constructor(firstFigure: Figure) {
        this.ctx.fillStyle = 'red';

        firstFigure.draw(this.ctx);
        this.ctx.fillStyle = 'black';
        firstFigure.drawBlack(this.ctx);

        this.figures = firstFigure.getNewFigures();
    }

    step() {
        let newFigures: Figure[] = [];

        this.figures.forEach((elm) => {
            elm.drawBlack(this.ctx);
            newFigures.push(...elm.getNewFigures());
        });

        this.figures = newFigures;
    }
}

let fractal = new Fractal(
    new Figure([
        { x: 10, y: 20 },
        { x: 700, y: 20 },
        { x: 10, y: 500 },
    ]),
);

// for (let i = 0; i < 7; i++) {
//     fractal.step();
// }

setInterval(() => {
    fractal.step();
}, 1000);
