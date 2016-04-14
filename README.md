# 使用canvas实现酷炫倒计时
示例地址：[链接](http://oulafen.github.io/demo-countdown/)

## 数字的实现
由小球组成的数字是使用 二维数组 + canvas
```
digit =
    [
        [
            [0,0,1,1,1,0,0],
            [0,1,1,0,1,1,0],
            [1,1,0,0,0,1,1],
            [1,1,0,0,0,1,1],
            [1,1,0,0,0,1,1],
            [1,1,0,0,0,1,1],
            [1,1,0,0,0,1,1],
            [1,1,0,0,0,1,1],
            [0,1,1,0,1,1,0],
            [0,0,1,1,1,0,0]
        ],//0
        [
            [0,0,0,1,1,0,0],
            [0,1,1,1,1,0,0],
            [0,0,0,1,1,0,0],
            [0,0,0,1,1,0,0],
            [0,0,0,1,1,0,0],
            [0,0,0,1,1,0,0],
            [0,0,0,1,1,0,0],
            [0,0,0,1,1,0,0],
            [0,0,0,1,1,0,0],
            [1,1,1,1,1,1,1]
        ],//1
        
        //...
    ]
```
```
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
```
## 运动的小球
- 检测变化的数字，在变化的数字上重绘彩色小球
```
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
        //...
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
```
- 给彩色小球设置运动值，刷新桢，具体实现原理参考[运动的小球](http://oulafen.github.io/demo-moving-ball/)
- 优化彩色小球数组，避免内存崩溃
```
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

    //维护数组，避免内存报警
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
```

