let time;
let path;
let x;
let y;
let fX;
let fY;
let mode = 2;
let red = 'red';
let M = Math;
let pi = M.PI;
let pi2 = pi * 2;
let o = 100;

a.onmousedown = () => {
    mode = 0;
    time = 0;
    path = [];
    x = [];
    y = [];
};

a.onmouseup = () => {
    mode = 1;
    const comp = (a, b) => b.a - a.a;
    fX = fourierT(x);
    fY = fourierT(y);
    fX.sort(comp);
    fY.sort(comp);
};

a.onmousemove = e => {
    if (!mode) {
        x.push(e.pageX);
        y.push(e.pageY);
    }
};

let stroke = col => {
    c.strokeStyle = col;
    c.stroke();
},
lineTo = (x, y, i) => {
    if (i) {
        c.lineTo(x, y);
    } else {
        c.moveTo(x, y);
    }
},
drawFourier = (cx, cy, rotation, fourier) => {
        let x = cx;
        let y = cy;
        fourier.forEach(item => {
            let prevx = x;
            let prevy = y;
            let radius = item.a;
            let angle = item.p + time * item.f + rotation;
            x += radius * M.cos(angle);
            y += radius * M.sin(angle);
            c.beginPath();
            c.arc(prevx, prevy, radius * 2, 0, pi2);
            lineTo(prevx, prevy, 0);
            lineTo(x, y);
            stroke('#555');
        });
        return {x, y};
    },
    loop = () => {
        c.fillStyle = '#000';
        c.fillRect(0, 0, a.width, a.height);
        if (mode === 1) {
            let vx = drawFourier(o, o, 0, fX);
            let vy = drawFourier(o, o, pi / 2, fY);
            path.push({x: vx.x, y: vy.y});

            c.beginPath();
            path.forEach((v, i) => {
                lineTo(v.x, v.y, i);
            });
            stroke(red);
            time += pi2 / fY.length;
            if (time > pi2) {
                time = 0;
                path = [];
            }
        } else if (mode === 0) {
            c.beginPath();
            x.forEach((v, i) => {
                lineTo(v, y[i], i);
            });
            stroke(red);
        }
        requestAnimationFrame(loop);
    },
    fourierT = data => {
        let N = data.length;
        return data.map((_, k) => {
            let re = 0;
            let im = 0;
            for (let n = 0; n < N; n++) {
                let x = (pi * 2 * k * n) / N;
                re += data[n] * M.cos(x);
                im -= data[n] * M.sin(x);
            }
            re = re / N;
            im = im / N;
            return {
                f: k,
                a: M.hypot(re, im),
                p: M.atan2(im, re)
            };
        });
    };

loop();
