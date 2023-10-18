let elm = document.getElementById("canvas");
let ctx = elm.getContext("2d");

ctx.font = "30px Comic Sans MS";
ctx.textAlign = "center";

const GAME_TYPES = {
    easy: {
        wCellsCount: 10,
        hCellsCount: 10,
        minesCount:10
    }
}

let gameType = GAME_TYPES.easy, game;

const COLORS = {
    background: "black",
    
    cell_default_background: "aqua",
    cell_mine_background: "red",
    cell_clicked_background: "grey",
    
    icons: "black"
}

const ICONS = {
    flag (x,y) {
        let w = elm.clientWidth / gameType.wCellsCount;
        let h = elm.clientHeight / gameType.hCellsCount;
        
        ctx.fillStyle = COLORS.icons;

        ctx.beginPath();
        ctx.moveTo(w*x + w*0.3, h*y + h*0.1);
        ctx.lineTo(w*x + w*0.4, h*y + h*0.1);
        ctx.lineTo(w*x + w*0.8, h*y + h*0.35);
        ctx.lineTo(w*x + w*0.4, h*y + h*0.6);
        ctx.lineTo(w*x + w*0.4, h*y + h*0.9);
        ctx.lineTo(w*x + w*0.3, h*y + h*0.9);
        ctx.lineTo(w*x + w*0.3, h*y + h*0.1);
        ctx.fill();
    },

    mine (x, y) {
        let w = elm.clientWidth / gameType.wCellsCount;
        let h = elm.clientHeight / gameType.hCellsCount;
        
        ctx.fillStyle = COLORS.icons;

        ctx.beginPath();
        ctx.arc(w*x+w/2, h*y+h/2, 0.3*h, 0, 2*Math.PI);

        ctx.fill();
    }
}

class Cell {
    flag = false;
    activated = false;
    active = true;
    background = COLORS.cell_default_background;
    icon = undefined;
    nearCells = undefined;
    mine = false;

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.draw();
    }
    
    click() {
        if(!this.active || this.flag) return;
    }

    rightClick() {
        if(!this.active || this.activated) return;

        this.icon = this.flag ? undefined : "flag";
        this.flag = !this.flag

        this.draw()
    }

    hover(bool = true) {

    }

    clear() {
        let w = elm.clientWidth / gameType.wCellsCount;
        let h = elm.clientHeight / gameType.hCellsCount;
        
        ctx.fillStyle = COLORS.background;

        ctx.fillRect(w*this.x, h*this.y, w, h);
    }

    draw() {
        let w = elm.clientWidth / gameType.wCellsCount;
        let h = elm.clientHeight / gameType.hCellsCount;
    
        this.clear()
        ctx.beginPath();

        ctx.fillStyle = this.background;

        ctx.roundRect(
            w*this.x+w*0.065,
            h*this.y+h*0.065,
            w * 0.87,
            h * 0.87,
            5
        );

        ctx.fill();

        console.log(this.icon)

        if(this.icon) {
            if(ICONS[this.icon]) ICONS[this.icon](this.x, this.y)
            else {
                ctx.fillStyle = COLORS.icons;
                ctx.fillText(this.icon, w*this.x+w*0.5, h*this.y+h*0.7,);
            }
        };
    }
}

class FreeCell extends Cell {
    click() {
        if(!this.active || this.flag) return;

        if(!this.nearCells) {
            this.nearCells = [];

            for(let i = 0;i<game.field.length;i++) {
                if( 
                    [this.x - 1, this.x, this.x + 1].includes(game.field[i].x) &&
                    [this.y - 1, this.y, this.y + 1].includes(game.field[i].y) &&
                    !(game.field[i].x == this.x && game.field[i].y == this.y)
                )
                this.nearCells.push(game.field[i])
            }
        }

        let nearMinesCount = this.nearCells.reduce((acc, x) => acc + (x.mine ? 1 : 0), 0);

        if(this.activated) {
            let nearFlagedMinesCount = this.nearCells.reduce((acc, x) => acc + (x.mine && (x.flag || !x.active || x.activated) ? 1 : 0), 0);

            if(nearMinesCount == nearFlagedMinesCount) {
                this.nearCells.filter(elm => !(elm.flag || elm.activated)).forEach(elm => elm.click())
                this.active = false;
            }

            return;
        } else {
            this.activated = true;
            this.background = COLORS.cell_clicked_background;

            if(nearMinesCount != 0) this.icon = nearMinesCount;
            else {
                this.nearCells.forEach(elm => elm.click());
            }

            this.draw()
        };
    }
}

class MineCell extends Cell {
    mine = true;

    constructor(x,y) {
        super(x,y);
    }

    click() {
        // super.click();
        if(!this.active || this.flag) return;

        this.active = false;
        this.activated = true;
        this.background = COLORS.cell_mine_background;
        this.icon = "mine";

        this.draw();
    }
}

class Game {
    field = [];

    constructor() {
        this.fillBlackScreen();

        let mines = [], cell;
        for(let i = 0;i<gameType.minesCount;i++) {
            cell = [
                Math.floor(Math.random()*gameType.wCellsCount),
                Math.floor(Math.random()*gameType.hCellsCount)
            ]

            if(!mines.some(elm => elm[0] == cell[0] && elm[1] == cell[1])) mines.push(cell);
            else i--
        };

        for(let x = 0; x<gameType.hCellsCount;x++) for(let y = 0; y<gameType.hCellsCount;y++) this.field.push(
            mines.some(elm => elm[0] == x && elm[1] == y) ? new MineCell(x,y) : new FreeCell(x,y)
        )


    }

    fillBlackScreen() {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,elm.clientWidth,elm.clientHeight);
    }

    getCell(x,y) {
        return this.field.find(elm => elm.x == x && elm.y == y);
    }
}

game = new Game();

// Транслятор преобразует координаты относительно страницы в положение клетки.
function translator (ev) {
    let w = elm.clientWidth / gameType.wCellsCount;
    let h = elm.clientHeight / gameType.hCellsCount;

    return {
        x: Math.floor((ev.pageX - elm.offsetLeft - elm.clientLeft)/w),
        y: Math.floor((ev.pageY - elm.offsetTop + elm.clientTop)/h)
    }
};

let currentCell = null;

elm.addEventListener('mousedown', (ev) => {
    currentCell = translator(ev)
});

elm.addEventListener('mouseup', (ev) => {
    let cell = translator(ev)

    if(currentCell.x !== cell.x || currentCell.y !== cell.y) return currentCell = null;

    if(ev.button == 0) game.getCell(cell.x, cell.y).click();
    else if(ev.button = 2) game.getCell(cell.x, cell.y).rightClick();
});

elm.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
})