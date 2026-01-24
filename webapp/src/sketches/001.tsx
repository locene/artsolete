import _ from 'lodash';
import { Application, Container, Graphics, Rectangle } from 'pixi.js';

const global = {
    width: 400,
    height: 400,
};

const colors = [
    // Colors are from nipponcolors.com
    '#DC9FB4', '#E16B8C', '#8E354A', '#F8C3CD', '#F4A7B9', '#64363C', '#F596AA', '#B5495B', '#E87A90', '#D05A6E',
    '#DB4D6D', '#FEDFE1', '#9E7A7A', '#80787b', '#9F353A', '#CB1B45', '#EEA9A9', '#BF6766', '#86473F', '#B19693',
    '#EB7A77', '#954A45', '#A96360', '#CB4042', '#AB3B3A', '#D7C4BB', '#904840', '#734338', '#C73E3A', '#554236',
    '#994639', '#F19483', '#B54434', '#B9887D', '#F17C67', '#884C3A', '#E83015', '#D75455', '#B55D4C', '#854836',
    '#A35E47', '#CC543A', '#724832', '#F75C2F', '#6A4028', '#9A5034', '#C46243', '#AF5F3C', '#FB966E', '#724938',
    '#B47157', '#DB8E71', '#F05E1C', '#ED784A', '#CA7853', '#B35C37', '#563F2E', '#E3916E', '#8F5A3C', '#F0A986',
    '#A0674B', '#C1693C', '#FB9966', '#947A6D', '#A36336', '#E79460', '#7D532C', '#C78550', '#985F2A', '#E1A679',
    '#855B32', '#FC9F4D', '#FFBA84', '#E98B2A', '#E9A368', '#B17844', '#96632E', '#43341B', '#CA7A2C', '#ECB88A',
    '#78552B', '#B07736', '#967249', '#E2943B', '#C7802D', '#9B6E23', '#6E552F', '#EBB471', '#D7B98E', '#82663A',
    '#B68E55', '#BC9F77', '#876633', '#C18A26', '#FFB11B', '#D19826', '#DDA52D', '#C99833', '#F9BF45', '#DCB879',
    '#BA9132', '#E8B647', '#F7C242', '#7D6C46', '#DAC9A6', '#FAD689', '#D9AB42', '#F6C555', '#FFC408', '#EFBB24',
    '#CAAD5F', '#8D742A', '#B4A582', '#877F6C', '#897D55', '#74673E', '#A28C37', '#6C6024', '#867835', '#62592C',
    '#E9CD4C', '#F7D94C', '#FBE251', '#D9CD90', '#ADA142', '#DDD23B', '#A5A051', '#BEC23F', '#6C6A2D', '#939650',
    '#838A2D', '#B1B479', '#616138', '#4B4E2A', '#5B622E', '#4D5139', '#89916B', '#90B44B', '#91AD70', '#B5CAA0',
    '#646A58', '#7BA23F', '#86C166', '#4A593D', '#42602D', '#516E41', '#91B493', '#808F7C', '#1B813E', '#5DAC81',
    '#36563C', '#227D51', '#A8D8B9', '#6A8372', '#2D6D4B', '#465D4C', '#24936E', '#86A697', '#00896C', '#096148',
    '#20604F', '#0F4C3A', '#4F726C', '#00AA90', '#69B0AC', '#26453D', '#66BAB7', '#268785', '#405B55', '#305A56',
    '#78C2C4', '#376B6D', '#A5DEE4', '#77969A', '#6699A1', '#81C7D4', '#33A6B8', '#0C4842', '#0D5661', '#0089A7',
    '#336774', '#255359', '#1E88A8', '#566C73', '#577C8A', '#58B2DC', '#2B5F75', '#3A8FB7', '#2E5C6E', '#006284',
    '#7DB9DE', '#51A8DD', '#2EA9DF', '#0B1013', '#0F2540', '#08192D', '#005CAF', '#0B346E', '#7B90D2', '#6E75A4',
    '#261E47', '#113285', '#4E4F97', '#211E55', '#8B81C3', '#70649A', '#9B90C2', '#8A6BBE', '#6A4C9C', '#8F77B5',
    '#533D5B', '#B28FCE', '#986DB2', '#77428D', '#3C2F41', '#4A225D', '#66327C', '#592C63', '#6F3381', '#574C57',
    '#B481BB', '#3F2B36', '#572A3F', '#5E3D50', '#72636E', '#622954', '#6D2E5B', '#C1328E', '#A8497A', '#562E37',
    '#E03C8A', '#60373E', '#FCFAF2', '#FFFFFB', '#BDC0BA', '#91989F', '#787878', '#828282', '#787D7B', '#707C74',
    '#656765', '#535953', '#4F4F48', '#52433D', '#373C38', '#3A3226', '#434343', '#1C1C1C', '#080808', '#0C0C0C',
];

function drawSquares(graphics: Graphics) {
    const num = 10;
    const size = 40;

    const shuffledColors = _.shuffle(colors);
    const squares: { x: number, y: number, size: number, color: string }[] = [];

    for (let x = 0; x < num; x++) {
        for (let y = 0; y < num; y++) {
            const color = shuffledColors[x * num + y];

            const effectiveSize = size - (Math.floor(Math.random() * 4) + 1) * 8;

            const posX = x * size + ((size - effectiveSize) / 2);
            const posY = y * size + ((size - effectiveSize) / 2);

            squares.push({ x: posX, y: posY, size: effectiveSize, color });
        }
    }

    graphics.clear();
    for (const square of squares) {
        graphics
            .rect(square.x, square.y, square.size, square.size)
            .fill({ color: `${square.color}` });
    }
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

    drawSquares(graphics);

    container.on('pointerdown', () => {
        drawSquares(graphics);
    });

    return app;
}
