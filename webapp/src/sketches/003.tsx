import { Application, Container, Graphics, Rectangle, Ticker } from 'pixi.js';

const global = {
    width: 400,
    height: 400,
};

const tau = Math.PI * 2;
const animationDuration = 1350;
const segmentCount = 12;
const outerEdgeRadius = 178;
const edgeGap = 2;

const palettes = [
    { dark: '#981830', light: '#F0A0B8' },
    { dark: '#A83208', light: '#F0B880' },
    { dark: '#0A6828', light: '#72E0A0' },
    { dark: '#087070', light: '#6CE0E0' },
    { dark: '#0844A0', light: '#88C0F0' },
    { dark: '#2810A0', light: '#A888E8' },
    { dark: '#900870', light: '#F080D8' },
];

const ringProfiles = [
    { lobeRadius: 9, dotRadius: 5, handleSize: 2.45 },
    { lobeRadius: 8.25, dotRadius: 4.55, handleSize: 2.4 },
    { lobeRadius: 7.5, dotRadius: 4.1, handleSize: 2.35 },
    { lobeRadius: 6.75, dotRadius: 3.7, handleSize: 2.3 },
    { lobeRadius: 6, dotRadius: 3.3, handleSize: 2.25 },
    { lobeRadius: 5.25, dotRadius: 2.95, handleSize: 2.2 },
    { lobeRadius: 4.5, dotRadius: 2.6, handleSize: 2.1 },
    { lobeRadius: 3.75, dotRadius: 2.25, handleSize: 2.0 },
    { lobeRadius: 3, dotRadius: 1.9, handleSize: 1.9 },
];

type Point = {
    x: number
    y: number
};

type Circle = {
    center: Point
    radius: number
};

type SegmentShape = {
    color: string
    originCircle: Circle
    leftCircle: Circle
    rightCircle: Circle
    handleSize: number
    delay: number
};

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, amount: number) {
    return start + (end - start) * amount;
}

function lerpPoint(start: Point, end: Point, amount: number) {
    return {
        x: lerp(start.x, end.x, amount),
        y: lerp(start.y, end.y, amount),
    };
}

function distance(pointA: Point, pointB: Point) {
    return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
}

function angleBetween(pointA: Point, pointB: Point) {
    return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
}

function getVector(origin: Point, angle: number, length: number) {
    return {
        x: origin.x + Math.cos(angle) * length,
        y: origin.y + Math.sin(angle) * length,
    };
}

function getOuterArcAnticlockwise(startAngle: number, endAngle: number, circle: Circle, reference: Point): boolean {
    const start = ((startAngle % tau) + tau) % tau;
    const end = ((endAngle % tau) + tau) % tau;
    const clockwiseSweep = (start - end + tau) % tau;
    const counterClockwiseSweep = (end - start + tau) % tau;
    const clockwiseMid = start - clockwiseSweep / 2;
    const counterClockwiseMid = start + counterClockwiseSweep / 2;
    const clockwiseMidPoint = getVector(circle.center, clockwiseMid, circle.radius);
    const counterClockwiseMidPoint = getVector(circle.center, counterClockwiseMid, circle.radius);
    return distance(clockwiseMidPoint, reference) > distance(counterClockwiseMidPoint, reference);
}

function drawCircle(graphics: Graphics, circle: Circle, color: string) {
    graphics.circle(circle.center.x, circle.center.y, circle.radius).fill({ color });
}

function drawMetaballConnector(graphics: Graphics, circleA: Circle, circleB: Circle, color: string, handleSize: number, spread: number) {
    const d = distance(circleA.center, circleB.center);
    const halfPi = Math.PI / 2;

    if (circleA.radius === 0 || circleB.radius === 0 || d === 0 || d <= Math.abs(circleA.radius - circleB.radius)) {
        return;
    }

    let u1 = 0;
    let u2 = 0;

    if (d < circleA.radius + circleB.radius) {
        u1 = Math.acos(clamp((circleA.radius ** 2 + d ** 2 - circleB.radius ** 2) / (2 * circleA.radius * d), -1, 1));
        u2 = Math.acos(clamp((circleB.radius ** 2 + d ** 2 - circleA.radius ** 2) / (2 * circleB.radius * d), -1, 1));
    }

    const centerAngle = angleBetween(circleA.center, circleB.center);
    const maxSpread = Math.acos(clamp((circleA.radius - circleB.radius) / d, -1, 1));
    const effectiveSpread = clamp(spread, 0.1, 0.9);
    const angle1 = centerAngle + u1 + (maxSpread - u1) * effectiveSpread;
    const angle2 = centerAngle - u1 - (maxSpread - u1) * effectiveSpread;
    const angle3 = centerAngle + Math.PI - u2 - (Math.PI - u2 - maxSpread) * effectiveSpread;
    const angle4 = centerAngle - Math.PI + u2 + (Math.PI - u2 - maxSpread) * effectiveSpread;
    const p1 = getVector(circleA.center, angle1, circleA.radius);
    const p2 = getVector(circleA.center, angle2, circleA.radius);
    const p3 = getVector(circleB.center, angle3, circleB.radius);
    const p4 = getVector(circleB.center, angle4, circleB.radius);
    const totalRadius = circleA.radius + circleB.radius;
    const curveSpan = distance(p1, p3);
    const handleFactorBase = Math.min(handleSize, curveSpan / totalRadius);
    const handleFactor = handleFactorBase * Math.min(1, d / (totalRadius * 1.4));
    const rA = circleA.radius * handleFactor;
    const rB = circleB.radius * handleFactor;
    const h1 = getVector(p1, angle1 - halfPi, rA);
    const h2 = getVector(p2, angle2 + halfPi, rA);
    const h3 = getVector(p3, angle3 + halfPi, rB);
    const h4 = getVector(p4, angle4 - halfPi, rB);
    const arcBAnticlockwise = getOuterArcAnticlockwise(angle3, angle4, circleB, circleA.center);
    const arcAAnticlockwise = getOuterArcAnticlockwise(angle2, angle1, circleA, circleB.center);

    graphics.moveTo(p1.x, p1.y);
    graphics.bezierCurveTo(h1.x, h1.y, h3.x, h3.y, p3.x, p3.y);
    graphics.arc(circleB.center.x, circleB.center.y, circleB.radius, angle3, angle4, arcBAnticlockwise);
    graphics.bezierCurveTo(h4.x, h4.y, h2.x, h2.y, p2.x, p2.y);
    graphics.arc(circleA.center.x, circleA.center.y, circleA.radius, angle2, angle1, arcAAnticlockwise);
    graphics.closePath();
    graphics.fill({ color });
}

function createComposition() {
    const palette = palettes[Math.floor(Math.random() * palettes.length)];
    const startsDark = Math.random() < 0.5;
    const center = { x: global.width / 2, y: global.height / 2 };
    const baseRotation = -0.08 + Math.random() * 0.16;
    const spiralDirection = Math.random() < 0.5 ? -1 : 1;
    const spiralPhaseStep = (0.095 + Math.random() * 0.045) * spiralDirection;
    const segments: SegmentShape[] = [];

    let r = outerEdgeRadius;
    const layouts = ringProfiles.map(({ lobeRadius, dotRadius, handleSize }) => {
        r -= lobeRadius;
        const radius = r;

        r -= lobeRadius + edgeGap;
        return { radius, lobeRadius, dotRadius, handleSize, stretch: Math.PI * radius / segmentCount - lobeRadius * 1.85 };
    });

    layouts.forEach((ring, ringIndex) => {
        const rotationOffset = baseRotation + ringIndex * spiralPhaseStep;
        const ringDelay = ringIndex * 0.045;

        for (let segmentIndex = 0; segmentIndex < segmentCount; segmentIndex++) {
            const angle = rotationOffset + (tau * segmentIndex / segmentCount) - Math.PI / 2;
            const tangent = { x: -Math.sin(angle), y: Math.cos(angle) };
            const origin = { x: center.x + Math.cos(angle) * ring.radius, y: center.y + Math.sin(angle) * ring.radius };
            const originCircle = { center: origin, radius: ring.dotRadius };
            const leftCircle = {
                center: { x: origin.x - tangent.x * ring.stretch, y: origin.y - tangent.y * ring.stretch },
                radius: ring.lobeRadius,
            };
            const rightCircle = {
                center: { x: origin.x + tangent.x * ring.stretch, y: origin.y + tangent.y * ring.stretch },
                radius: ring.lobeRadius,
            };

            segments.push({
                color: (startsDark ? segmentIndex % 2 === 0 : segmentIndex % 2 !== 0) ? palette.dark : palette.light,
                originCircle,
                leftCircle,
                rightCircle,
                handleSize: ring.handleSize,
                delay: ringDelay + segmentIndex * 0.0125,
            });
        }
    });

    return { segments };
}

function getCompositionScale(segments: SegmentShape[]) {
    const cx = global.width / 2, cy = global.height / 2;
    let mx = 1, my = 1;

    for (const { originCircle: o, leftCircle: l, rightCircle: r } of segments) {
        for (const c of [o, l, r]) {
            mx = Math.max(mx, Math.abs(c.center.x - cx) + c.radius);
            my = Math.max(my, Math.abs(c.center.y - cy) + c.radius);
        }
    }

    return Math.min(global.width / 2 / mx, global.height / 2 / my);
}

function drawAnimatedSegment(graphics: Graphics, segment: SegmentShape, progress: number) {
    const revealProgress = clamp((progress - segment.delay) / (1 - segment.delay), 0, 1);

    if (revealProgress <= 0.001) {
        drawCircle(graphics, segment.originCircle, segment.color);
        return;
    }

    const v = revealProgress;
    const splitProgress = v < 0.5
        ? 4 * v ** 3
        : 1 - ((-2 * v + 2) ** 3) / 2;
    const lobeGrowth = 1 - (1 - v) ** 3;
    const leftCircle = {
        center: lerpPoint(segment.originCircle.center, segment.leftCircle.center, splitProgress),
        radius: lerp(segment.originCircle.radius * 0.96, segment.leftCircle.radius, lobeGrowth),
    };
    const rightCircle = {
        center: lerpPoint(segment.originCircle.center, segment.rightCircle.center, splitProgress),
        radius: lerp(segment.originCircle.radius * 0.96, segment.rightCircle.radius, lobeGrowth),
    };
    const bridgeDistance = distance(leftCircle.center, rightCircle.center);
    const handleSize = lerp(0.18, segment.handleSize * 0.5, lobeGrowth);

    const rC = leftCircle.radius;
    const totalRadius = rC * 2;
    const u1 = bridgeDistance < totalRadius
        ? Math.acos(clamp(bridgeDistance / totalRadius, -1, 1))
        : 0;
    const targetWaistHalf = rC * lerp(1, 0.25, splitProgress);
    const fullD = distance(segment.leftCircle.center, segment.rightCircle.center);
    const initHF = handleSize * Math.min(1, fullD / (totalRadius * 1.4));
    const initK = 0.75 * initHF;
    const initR = Math.sqrt(1 + initK * initK);
    let spread = clamp(
        (Math.asin(clamp(targetWaistHalf / (rC * initR), -1, 1)) + Math.atan2(initK, 1)) / (Math.PI / 2),
        0.1, 0.9,
    );
    for (let i = 0; i < 3; i++) {
        const angle1 = u1 + (Math.PI / 2 - u1) * clamp(spread, 0.1, 0.9);
        const curveSpan = Math.max(0, bridgeDistance - 2 * rC * Math.cos(angle1));
        const hFactor = Math.min(handleSize, curveSpan / totalRadius) * Math.min(1, bridgeDistance / (totalRadius * 1.4));
        const K = 0.75 * hFactor;
        const R = Math.sqrt(1 + K * K);
        spread = clamp(
            (Math.asin(clamp(targetWaistHalf / (rC * R), -1, 1)) + Math.atan2(K, 1)) / (Math.PI / 2),
            0.1, 0.9,
        );
    }

    if (bridgeDistance < 0.6) {
        drawCircle(graphics, segment.originCircle, segment.color);
        return;
    }

    drawMetaballConnector(graphics, leftCircle, rightCircle, segment.color, handleSize, spread);

    drawCircle(graphics, leftCircle, segment.color);
    drawCircle(graphics, rightCircle, segment.color);
}

export async function sketch(canvas: HTMLCanvasElement) {
    const app = new Application();

    await app.init({
        width: global.width,
        height: global.height,
        backgroundAlpha: 0,
        canvas: canvas,
        antialias: true,
        autoDensity: true,
        resolution: Math.max(2, window.devicePixelRatio || 1),
    });

    const container = new Container();
    app.stage.addChild(container);

    container.interactive = true;
    container.hitArea = new Rectangle(0, 0, global.width, global.height);
    container.cursor = 'pointer';

    const graphics = new Graphics();
    container.addChild(graphics);

    let composition = createComposition();
    let elapsed = 0;
    let isAnimating = true;

    const restart = () => {
        composition = createComposition();
        const scale = getCompositionScale(composition.segments);
        graphics.scale.set(scale);
        graphics.position.set(
            global.width / 2 - global.width / 2 * scale,
            global.height / 2 - global.height / 2 * scale,
        );
        elapsed = 0;
        isAnimating = true;
        graphics.clear();
        for (const segment of composition.segments) drawAnimatedSegment(graphics, segment, 0);
    };

    const animate = (ticker: Ticker) => {
        if (!isAnimating) {
            return;
        }

        elapsed += ticker.deltaMS;

        const progress = clamp(elapsed / animationDuration, 0, 1);
        graphics.clear();
        for (const segment of composition.segments) drawAnimatedSegment(graphics, segment, progress);

        if (progress === 1) {
            isAnimating = false;
        }
    };

    app.ticker.add(animate);
    restart();

    container.on('pointerdown', () => {
        restart();
    });

    return app;
}
