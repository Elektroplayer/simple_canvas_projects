const STEPS = 5;
const COLOR = 'white';

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
    specialDots: Dot[][] = [];

    constructor(public dots: Dot[]) {
        for (let i = 0; i < dots.length - 1; i++) {
            this.specialDots.push([
                new Dot((dots[i].x - dots[i + 1].x) / 3 + dots[i + 1].x, (dots[i].y - dots[i + 1].y) / 3 + dots[i + 1].y),
                new Dot((dots[i + 1].x - dots[i].x) / 3 + dots[i].x, (dots[i + 1].y - dots[i].y) / 3 + dots[i].y),
            ]);
        }

        this.specialDots.push([
            new Dot(
                (dots[0].x - dots[dots.length - 1].x) / 3 + dots[dots.length - 1].x,
                (dots[0].y - dots[dots.length - 1].y) / 3 + dots[dots.length - 1].y,
            ),
            new Dot((dots[dots.length - 1].x - dots[0].x) / 3 + dots[0].x, (dots[dots.length - 1].y - dots[0].y) / 3 + dots[0].y),
        ]);
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

        ctx.moveTo(this.specialDots[3][1].x, this.specialDots[0][1].y);
        ctx.lineTo(this.specialDots[3][0].x, this.specialDots[2][0].y);
        ctx.lineTo(this.specialDots[1][0].x, this.specialDots[2][1].y);
        ctx.lineTo(this.specialDots[1][1].x, this.specialDots[0][0].y);

        ctx.fillStyle = 'black';
        ctx.fill();
    }

    getNewFigures(): Figure[] {
        return [
            // 1
            new Figure([this.dots[0], this.specialDots[0][1], new Dot(this.specialDots[3][1].x, this.specialDots[0][1].y), this.specialDots[3][1]]),

            new Figure([
                this.specialDots[3][1],
                new Dot(this.specialDots[3][1].x, this.specialDots[0][1].y),
                new Dot(this.specialDots[3][0].x, this.specialDots[2][0].y),
                this.specialDots[3][0],
            ]),

            // 2
            new Figure([this.specialDots[0][0], this.dots[1], this.specialDots[1][1], new Dot(this.specialDots[1][1].x, this.specialDots[0][0].y)]),

            new Figure([
                this.specialDots[0][1],
                this.specialDots[0][0],
                new Dot(this.specialDots[1][1].x, this.specialDots[0][0].y),
                new Dot(this.specialDots[3][1].x, this.specialDots[0][1].y),
            ]),

            // 3
            new Figure([new Dot(this.specialDots[1][0].x, this.specialDots[2][1].y), this.specialDots[1][0], this.dots[2], this.specialDots[2][1]]),

            new Figure([
                new Dot(this.specialDots[1][1].x, this.specialDots[0][0].y),
                this.specialDots[1][1],
                this.specialDots[1][0],
                new Dot(this.specialDots[1][0].x, this.specialDots[2][1].y),
            ]),

            // 4
            new Figure([this.specialDots[3][0], new Dot(this.specialDots[3][0].x, this.specialDots[2][0].y), this.specialDots[2][0], this.dots[3]]),

            new Figure([
                new Dot(this.specialDots[3][0].x, this.specialDots[2][0].y),
                new Dot(this.specialDots[1][0].x, this.specialDots[2][1].y),
                this.specialDots[2][1],
                this.specialDots[2][0],
            ]),
        ];
    }
}

class Fractal {
    figures: Figure[] = [];

    constructor(
        public ctx: CanvasRenderingContext2D,
        firstFigure: Figure,
    ) {
        this.ctx.fillStyle = COLOR;

        firstFigure.draw(this.ctx);
        this.ctx.fillStyle = 'black';
        firstFigure.drawBlack(this.ctx);
        // firstFigure.drawBlackDots(this.ctx);

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

const element = <HTMLCanvasElement>document.getElementById('example');
const ctx = element.getContext('2d')!;

let figure = new Figure([new Dot(50, 50), new Dot(50, 500), new Dot(500, 500), new Dot(500, 50)]);
let fractal = new Fractal(ctx, figure);

for (let i = 0; i < STEPS; i++) {
    fractal.step();
}
