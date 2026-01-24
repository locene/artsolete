import { Application, Color, Container, Graphics, Rectangle } from 'pixi.js';

const global = {
    width: 400,
    height: 400,
};

function randomizeBorders() {
    const borders = [false, false];

    if (Math.random() < 0.5) {
        borders[0] = true;
    }

    if (Math.random() < 0.5) {
        borders[1] = true;
    }

    return borders;
}

function randomizeDotSize() {
    let dotSize = 0;

    if (Math.floor(Math.random() * 16) < 1) {
        dotSize = (Math.floor(Math.random() * 2) + 1) * 2;
    }

    return dotSize;
}

function generateSquares() {
    const num = 20;
    const size = 20;

    const squares: { position: { x: number, y: number }, size: number, borders: boolean[], dot: number }[] = [];

    for (let x = 0; x < num; x++) {
        for (let y = 0; y < num; y++) {
            const position = { x: x * size, y: y * size };

            squares.push({ position: position, size: size, borders: randomizeBorders(), dot: randomizeDotSize() });
        }
    }

    return squares;
}

function drawSquares(graphics: Graphics) {
    const squares = generateSquares();

    for (const [index, square] of squares.entries()) {
        let w = square.size;
        let h = square.size;

        let x = square.position.x;
        let y = square.position.y;

        const isCenterQuadrants = index == 189 || index == 190 || index == 209 || index == 210;

        if (!isCenterQuadrants) {
            if (square.borders[0]) {
                h -= 1;
                y += 1;
            }
            if (square.borders[1]) {
                w -= 1;
                x += 1;
            }

            graphics
                .rect(square.position.x, square.position.y, square.size, square.size)
                .fill({ color: 'black' })
                .rect(x, y, w, h)
                .cut();

            if (square.dot > 0) {
                graphics
                    .rect(
                        square.position.x + square.size / 2 - square.dot / 2,
                        square.position.y + square.size / 2 - square.dot / 2,
                        square.dot,
                        square.dot,
                    )
                    .fill({ color: 'black' });
            }
        }
    }
}

function drawRosewood(graphics: Graphics) {
    for (let i = 0; i < 3; i++) {
        const c = (0.925 - i * 0.075) * 255;
        const sideLength = 12 - (i * 4);

        graphics
            .rect(global.width / 2 - sideLength / 2, global.height / 2 - sideLength / 2, sideLength, sideLength)
            .fill({ color: new Color({ r: c, g: c, b: c }) });
    }
}

function draw(graphics: Graphics) {
    graphics.clear();

    drawSquares(graphics);
    drawRosewood(graphics);
}

export async function sketch(canvas: HTMLCanvasElement) {
    const app = new Application();

    await app.init({
        width: global.width,
        height: global.height,
        backgroundAlpha: 0,
        canvas: canvas,
    });

    const container = new Container();
    app.stage.addChild(container);

    container.interactive = true;
    container.hitArea = new Rectangle(0, 0, global.width, global.height);
    container.cursor = 'pointer';

    const graphics = new Graphics();
    container.addChild(graphics);

    draw(graphics);

    container.on('pointerdown', () => {
        draw(graphics);
    });

    return app;
}
