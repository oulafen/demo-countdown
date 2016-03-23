var WINDOW_WIDTH = 1024;
var WINDOW_HEIHGT = 600;
var R = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

const endTime = new Date();
endTime.setDate(endTime.getDate() + 1);
var curShowTimeSeconds = 0;

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function () {
    initSize();

    var canvas = document.getElementById('canvas');
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIHGT;

    var context = canvas.getContext('2d');

    curShowTimeSeconds = getCurrentShowTimeSeconds();

    setInterval(function () {
        render(context);
        update();
    }, 50);
};

window.onresize = function () {
    initSize();

    var canvas = document.getElementById('canvas');
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIHGT;
};

function initSize() {
    //自适应屏幕
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIHGT = document.body.clientHeight;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    R = Math.round(WINDOW_WIDTH * 0.8 / 108) - 1;
    MARGIN_TOP = Math.round(WINDOW_HEIHGT / 10);
}

function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMminutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMminutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    if (curSeconds != nextSeconds) {
        if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
        }
        if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (R + 1), MARGIN_TOP, parseInt(curHours % 10));
        }
        if (parseInt(curMminutes / 10) != parseInt(nextMminutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (R + 1), MARGIN_TOP, parseInt(curMminutes / 10));
        }
        if (parseInt(curMminutes % 10) != parseInt(nextMminutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (R + 1), MARGIN_TOP, parseInt(curMminutes % 10));
        }
        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (R + 1), MARGIN_TOP, parseInt(curSeconds / 10));
        }
        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (R + 1), MARGIN_TOP, parseInt(curSeconds % 10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();

}

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        //碰撞检测
        //底部检测
        if (balls[i].y > (WINDOW_HEIHGT - R)) {
            balls[i].y = WINDOW_HEIHGT - R;
            balls[i].vy = -balls[i].vy * 0.5;
        }
    }

    //维护数组
    var cnt = 0;
    for (var j = 0; j < balls.length; j++) {
        if ((balls[j].x + R) > 0 && (balls[j].x - R) < WINDOW_WIDTH) {
            balls[cnt++] = balls[j];
        }
    }
    while (balls.length > cnt) {
        balls.pop();
    }
}

function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();

    ret = Math.round(ret / 1000);
    return ret >= 0 ? ret : 0;
}

function render(context) {
    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
    var seconds = curShowTimeSeconds % 60;

    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIHGT);

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), context);
    renderDigit(MARGIN_LEFT + 15 * (R + 1 ), MARGIN_TOP, parseInt(hours % 10), context);
    renderDigit(MARGIN_LEFT + 30 * (R + 1 ), MARGIN_TOP, 10, context);
    renderDigit(MARGIN_LEFT + 39 * (R + 1 ), MARGIN_TOP, parseInt(minutes / 10), context);
    renderDigit(MARGIN_LEFT + 54 * (R + 1 ), MARGIN_TOP, parseInt(minutes % 10), context);
    renderDigit(MARGIN_LEFT + 69 * (R + 1 ), MARGIN_TOP, 10, context);
    renderDigit(MARGIN_LEFT + 78 * (R + 1 ), MARGIN_TOP, parseInt(seconds / 10), context);
    renderDigit(MARGIN_LEFT + 93 * (R + 1 ), MARGIN_TOP, parseInt(seconds % 10), context);

    for (var i = 0; i < balls.length; i++) {
        context.beginPath();
        context.arc(balls[i].x, balls[i].y, R, 0, 2 * Math.PI);
        context.closePath();
        context.fillStyle = balls[i].color;
        context.fill();
    }
}

function renderDigit(x, y, num, context) {
    context.fillStyle = 'rgb(0,102,153)';

    for (var i = 0; i < digit[num].length; i++) {//行
        for (var j = 0; j < digit[num][i].length; j++) { //列
            if (digit[num][i][j] == 1) {
                context.beginPath();

                var x1 = x + (2 * j + 1) * (R + 1);
                var y1 = y + (2 * i + 1) * (R + 1);

                context.arc(x1, y1, R, 0, 2 * Math.PI);
                context.closePath();

                context.fill();
            }
        }
    }
}

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {//行
        for (var j = 0; j < digit[num][i].length; j++) { //列
            if (digit[num][i][j] == 1) {
                var aBall = {
                    x: x + (2 * j + 1) * (R + 1),
                    y: y + (2 * i + 1) * (R + 1),
                    g: 1.5 * Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
                balls.push(aBall);
            }
        }
    }
}