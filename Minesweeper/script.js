let elm = document.getElementById("canvas");
let ctx = elm.getContext("2d");

let minesElm = document.getElementById("openedMines");
let allMinesElm = document.getElementById("allMines");

ctx.font = "Arcade";

const GAME_TYPES = {
    easy: {
        wCellsCount: 10,
        hCellsCount: 10,
        minesCount: 20
    },
    medium: {
        wCellsCount: 20,
        hCellsCount: 50,
        minesCount: 50
    }
}

let gameType = GAME_TYPES.easy;

allMinesElm.innerHTML = gameType.minesCount;

const COLORS = {
    background: "black",
    
    cell_default_background: "aqua",
    cell_mine_background: "red",
    cell_clicked_background: "grey",
    cell_win_background: "green",
    
    icons: "black"
}

class IconGenerator {
    constructor(x, y, a) {
        this.x = x;
        this.y = y;
        this.a = a;
    }

    moveTo(x,y) {
        return ctx.moveTo(this.a*this.x + this.a*x, this.a*this.y + this.a*y)
    }

    moveTo16(x,y) {
        return ctx.moveTo(this.a*this.x + this.a/16*x, this.a*this.y + this.a/16*y);
    }

    lineTo(x,y) {
        return ctx.lineTo(this.a*this.x + this.a*x, this.a*this.y + this.a*y);
    }

    fillRect(x,y,w,h) {
        return ctx.fillRect(this.a*this.x + this.a*x, this.a*this.y + this.a*y, this.a*w, this.a*h);
    }

    fillRect16(x,y,w,h) {
        return ctx.fillRect(this.a*this.x + this.a/16*x, this.a*this.y + this.a/16*y, this.a/16*w, this.a/16*h);
    }

    flag () {        
        ctx.fillStyle = COLORS.icons;

        ctx.beginPath();

        this.fillRect16(4,12,8,1);
        this.fillRect16(5,11,6,1.5);
        this.fillRect16(7,3,1,9);

        ctx.fillStyle = "#d60e06";

        this.fillRect16(8,3,1,4);
        this.fillRect16(8,4,2,1);
        this.fillRect16(8,5,3,1.2);

        ctx.fill();
    }

    mine () {        
        ctx.fillStyle = COLORS.icons;

        ctx.beginPath();
        ctx.arc(this.a*this.x+this.a/2, this.a*this.y+this.a/2, 0.3*this.a, 0, 2*Math.PI);

        ctx.fill();
    }
}

class Cell {
    flag        = false;
    activated   = false;
    active      = true;
    background  = COLORS.cell_default_background;
    icon        = undefined;
    nearCells   = undefined;
    mine        = false;

    constructor(x, y, mine, grid) {
        this.x = x;
        this.y = y;
        this.grid = grid;
        this.mine = mine;

        this.iconGenerator = new IconGenerator(x, y, grid.a);

        this.draw();
    }

    draw() {
        this.clear();

        ctx.beginPath();

        ctx.fillStyle = this.background;

        ctx.roundRect(
            this.grid.a*this.x+this.grid.a*0.065,
            this.grid.a*this.y+this.grid.a*0.065,
            this.grid.a*0.87,
            this.grid.a*0.87,
            this.grid.a/10
        );

        ctx.fill();

        if(this.icon) {
            if(this.iconGenerator[this.icon]) this.iconGenerator[this.icon]()
            else {
                ctx.font = this.grid.a + "px Arcade";
                ctx.textAlign = "center";
                ctx.fillStyle = COLORS.icons;
                ctx.fillText(this.icon, this.grid.a*this.x+this.grid.a*0.5, this.grid.a*this.y+this.grid.a*0.8);
            }
        }
    }

    clear() {
        ctx.fillStyle = COLORS.background;

        ctx.fillRect(this.grid.a*this.x, this.grid.a*this.y, this.grid.a, this.grid.a);
    }

    checkWin() {
        if(this.grid.fields.filter(elm => elm.mine == false).every(elm => elm.activated == true)) {
            this.grid.fields.forEach(elm => {
                elm.win()
            })
        }
    }

    rightClick() {
        if(!this.active || this.activated) return;

        this.icon = this.flag ? undefined : "flag";
        this.flag = !this.flag

        minesElm.innerText = +minesElm.innerText + (this.flag ? 1 : -1)

        this.draw()
    }

    click() {
        if(!this.active || this.flag) return;

        if(this.mine) {
            this.active = false;
            this.activated = true;
            this.background = COLORS.cell_mine_background;
            this.icon = "mine";
            this.grid.gameState = "stoped";

            this.draw();

            this.grid.fields.filter(elm => elm.mine && !elm.flag).forEach(elm => {
                elm.background = COLORS.cell_mine_background;
                elm.icon = "mine";
                elm.draw();
            })

            this.grid.fields.filter(elm => elm.flag && !elm.mine).forEach(elm => {
                elm.background = COLORS.cell_mine_background;
                elm.draw();
            })

        } else {
            if(!this.nearCells) {
                this.nearCells = [];

                for(let i = 0;i<this.grid.fields.length;i++) {
                    if( 
                        [this.x - 1, this.x, this.x + 1].includes(this.grid.fields[i].x) &&
                        [this.y - 1, this.y, this.y + 1].includes(this.grid.fields[i].y) &&
                        !(this.grid.fields[i].x == this.x && this.grid.fields[i].y == this.y)
                    )
                    this.nearCells.push(this.grid.fields[i])
                }
            }

            let nearMinesCount = this.nearCells.reduce((acc, x) => acc + (x.mine ? 1 : 0), 0);

            if(this.activated) {
                let nearFlagedCellsCount = this.nearCells.reduce((acc, x) => {
                    return acc + (x.flag ? 1 : 0)
                }, 0);

                if(nearMinesCount == nearFlagedCellsCount) {
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
            }
        }

        this.checkWin()
    }

    win() {
        if(this.mine) {
            this.flag = true;
            this.icon = "flag"
            this.background = COLORS.cell_win_background;
        }

        this.active = false;
        this.activated = true;

        this.draw()
    }
}

class Grid {
    fields = [];
    gameState = "notStarted"; // started, stoped

    constructor(w, h) {
        let a;
        if(Math.min(window.innerWidth, window.innerHeight) == window.innerWidth) a = window.innerWidth*.7/w;
        else a = window.innerHeight*.7/h;

        if(a*w>window.innerWidth) a = window.innerWidth*.7/w;
        if(a*h>window.innerHeight*.8) a = window.innerHeight*.8/h;

        this.w = w;
        this.h = h;
        this.a = a;

        ctx.canvas.width = (w*a);
        ctx.canvas.height = (h*a);

        ctx.fillStyle = "black";
        ctx.fillRect(0,0,(w*a),(h*a));

        for(let x = 0;x < this.w; x++) for(let y = 0;y < this.h; y++) this.fields.push(new Cell(x,y, false ,this));
    }

    minesGen(startCell) {
        let mines = [], cell;
        for(let i = 0;i<gameType.minesCount;i++) {
            cell = [
                Math.floor(Math.random()*this.w),
                Math.floor(Math.random()*this.h)
            ]

            if(!mines.some(
                elm => (elm[0] == cell[0] && elm[1] == cell[1]) ||
                (
                    [startCell.x-1, startCell.x, startCell.x+1].includes(cell[0]) && 
                    [startCell.y-1, startCell.y, startCell.y+1].includes(cell[1])
                )
            )) mines.push(cell);
            else i--
        }

        mines.forEach(elm => this.getCell(elm[0], elm[1]).mine = true )
5    }

    getCell(x,y) {
        return this.fields.find(elm => elm.x == x && elm.y == y);
    }
}

let grid = new Grid(gameType.wCellsCount, gameType.hCellsCount);

// Транслятор преобразует координаты относительно страницы в положение клетки.
function translator (ev) {
    let w = elm.clientWidth / gameType.wCellsCount;
    let h = elm.clientHeight / gameType.hCellsCount;

    return {
        x: Math.floor((ev.pageX - elm.offsetLeft - elm.clientLeft)/w),
        y: Math.floor((ev.pageY - elm.offsetTop + elm.clientTop)/h)
    }
}

let currentCell = null;

elm.addEventListener('mousedown', (ev) => {
    currentCell = translator(ev)
});

elm.addEventListener('mouseup', (ev) => {
    let cell = translator(ev)

    if(currentCell.x !== cell.x || currentCell.y !== cell.y) return currentCell = null;

    if(grid.gameState == "notStarted") {
        grid.minesGen(cell);
        grid.gameState = "started";
    } // = new Grid(gameType.wCellsCount, gameType.hCellsCount, cell);

    if(grid.gameState == "stoped") return;

    if(ev.button == 0) grid.getCell(cell.x, cell.y).click();
    else if(ev.button == 2) grid.getCell(cell.x, cell.y).rightClick();
});

elm.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
})