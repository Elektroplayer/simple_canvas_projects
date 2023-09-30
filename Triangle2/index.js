//  Дефолтные переменные
let example = document.getElementById('example');
let ctx     = example.getContext('2d');

function createTriangle (cords) { //  Создание треугольника
    ctx.beginPath();
    ctx.moveTo(cords[0].x, cords[0].y);
    ctx.lineTo(cords[1].x, cords[1].y);
    ctx.lineTo(cords[2].x, cords[2].y);
    ctx.fill();
}

function findCenter (cords) { //  Нахождение координаты центра между точками
    return {
        x: (cords[0].x + cords[1].x)/2,
        y: (cords[0].y + cords[1].y)/2
    };
}

//  Создаём массив из трёх точек (вершин начального треугольника)
let points = [
    {
        x: 300,
        y: 10
    },{
        x: example.width - 10,
        y: example.height - 10
    },{
        x: 10,
        y: example.height - 10
    }
];

let triangles = [points]; //  Массив с будущими треугольниками, но пока что он там один

ctx.fillStyle = 'red';
createTriangle(points);
ctx.fillStyle = 'black';

//  Создаём вечный интервал с повтором каждые 50мс
setInterval( () => {
    let tgl = triangles.shift(); // Выбираем треугольник и сразу убираем его из массива

    //  Создаём его
    createTriangle([
        findCenter([ tgl[0], tgl[1] ]),
        findCenter([ tgl[0], tgl[2] ]),
        findCenter([ tgl[1], tgl[2] ])
    ]);

    //  В одном большом треугольнике получилось 3 поменьше. Засовываем их в массив в конец
    triangles.push(
        [
            tgl[0],
            findCenter([ tgl[0], tgl[1] ]),
            findCenter([ tgl[0], tgl[2] ])
        ],[
            tgl[1],
            findCenter([ tgl[1], tgl[0] ]),
            findCenter([ tgl[1], tgl[2] ])
        ],[
            tgl[2],
            findCenter([ tgl[2], tgl[0] ]),
            findCenter([ tgl[2], tgl[1] ])
        ]
    );
    //  И повторяем пока не взорвётся комп)
},10 );
