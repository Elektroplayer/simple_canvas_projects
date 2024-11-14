//  Функция для создания кружочков
function circleCreate (x,y) {
    ctx.beginPath()
    ctx.arc(x, y, 1, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.closePath()
}
//  Ну дефолтные переменные
let example = document.getElementById("example");
let ctx     = example.getContext('2d');

//  Создаём массив из трёх точек (вершин треугольника)
let points = [
    {
        x: Math.floor(Math.random() * example.width),
        y: Math.floor(Math.random() * example.height)
    },{
        x: Math.floor(Math.random() * example.width),
        y: Math.floor(Math.random() * example.height)
    },{
        x: Math.floor(Math.random() * example.width),
        y: Math.floor(Math.random() * example.height)
    }
];

//  Создаём последнюю точку. Она нужно для понимания, куда поставить следующую
let last = {
    x: Math.floor(Math.random() * example.width),
    y: Math.floor(Math.random() * example.height)
}

ctx.fillStyle = 'green'; //  Ставим зелёный цвет

points.forEach(elm => circleCreate(elm.x, elm.y)); // Рисуем все точки

ctx.fillStyle = 'red'; // Ставим красный

setInterval(()=> { //  Создаём интервал. Можно сразу поставить массив, чтобы всё делать максимально быстро, но мне это не нужно
    let rand = Math.floor(Math.random()*3) //  Рандомное число

    //  Немного геометрии:
    //  Нам нужно поставить точку на середине между двумя существующими
    //  Для этого можно их координаты соединить и разделить на два
    //  Таким образом мы получим координату середины
    last = {
        x: (last.x + points[rand].x)/2,
        y: (last.y + points[rand].y)/2
    }

    circleCreate(last.x, last.y);
},50);
