use nannou::prelude::*;
use nannou::wgpu::{Backends, DeviceDescriptor, Limits};
use nannou::winit::window::CursorIcon;
use rand::Rng;
use std::cell::RefCell;

thread_local!(static SQUARES: RefCell<Option<Vec<(Vec2, Vec<bool>, f32, usize)>>> = RefCell::new(None));

pub async fn run_app() {
    app::Builder::new_async(|app| {
        Box::new(async move {
            create_window(app).await;
        })
    })
    .backends(Backends::PRIMARY | Backends::GL)
    .update(update)
    .run_async()
    .await;
}

async fn create_window(app: &App) {
    init();

    app.new_window()
        .size(400, 400)
        .device_descriptor(DeviceDescriptor {
            limits: Limits {
                max_texture_dimension_2d: 8192,
                ..Limits::downlevel_webgl2_defaults()
            },
            ..Default::default()
        })
        .title(format!("{}{}", "artsolete", env!("CARGO_PKG_NAME")))
        .view(view)
        .mouse_moved(mouse_moved)
        .mouse_pressed(mouse_pressed)
        .build_async()
        .await
        .unwrap();
}

fn update(_app: &App, _model: &mut (), _update: Update) {}

fn view(app: &App, _model: &(), frame: Frame) {
    let draw = app.draw();

    draw.background().color(rgba(0.0, 0.0, 0.0, 1.0));

    SQUARES.with(|s| {
        if let Some(squares) = &*s.borrow() {
            for (index, square) in squares.iter().enumerate() {
                draw_square(&draw, square, index);
            }
        }
    });

    draw_center(&draw);

    draw.to_frame(app, &frame).unwrap();
}

fn init() {
    let squares = generate_squares();
    SQUARES.with(|s| {
        *s.borrow_mut() = Some(squares);
    });
}

fn mouse_moved(app: &App, _model: &mut (), _point: Vec2) {
    app.main_window().set_cursor_icon(CursorIcon::Hand);
}

fn mouse_pressed(_app: &App, _model: &mut (), button: MouseButton) {
    match button {
        MouseButton::Left => {
            init();
        }
        _ => {}
    }
}

fn generate_squares() -> Vec<(Vec2, Vec<bool>, f32, usize)> {
    let mut squares = Vec::new();

    let num = 20;
    let size = 20.0;

    for x in 0..num {
        for y in 0..num {
            let position = pt2(
                x as f32 * size - 200.0 + 10.0,
                y as f32 * size - 200.0 + 10.0,
            );

            let borders = rand_borders();
            let dot = rand_dot();

            squares.push((position, borders, size, dot));
        }
    }

    squares
}

fn rand_borders() -> Vec<bool> {
    let mut rng = rand::thread_rng();

    let mut borders = vec![false; 2];

    if rng.gen_range(0..4) < 2 {
        borders[0] = true;
    }
    if rng.gen_range(0..4) < 2 {
        borders[1] = true;
    }

    borders
}

fn rand_dot() -> usize {
    let mut rng = rand::thread_rng();

    let mut dot = 0;

    if rng.gen_range(0..16) < 1 {
        dot = rng.gen_range(1..=2) * 2;
    }

    dot
}

fn draw_square(draw: &Draw, square: &(Vec2, Vec<bool>, f32, usize), index: usize) {
    let position = square.0;
    let borders = &square.1;
    let size = square.2;
    let dot = square.3;

    let mut w = size;
    let mut h = size;

    let mut x = position.x;
    let mut y = position.y;

    let is_center_quadrants = index == 189 || index == 190 || index == 209 || index == 210;

    if is_center_quadrants {
        draw.rect().color(WHITE).xy(pt2(x, y)).w(w).h(h);
    } else {
        if borders[0] {
            h -= 1.0;
            y += 0.5; // Adjusting the width may result in blurry edges, so a 0.5 offset is used for clarity.
        }
        if borders[1] {
            w -= 1.0;
            x += 0.5;
        }

        draw.rect().color(WHITE).xy(pt2(x, y)).w(w).h(h);

        if dot > 0 {
            draw.rect()
                .color(BLACK)
                .xy(position) // Use the original position values, not the adjusted ones.
                .w(dot as f32)
                .h(dot as f32);
        }
    }
}

fn draw_center(draw: &Draw) {
    for i in 0..3 {
        let f = i as f32;
        let c = 0.925 - f * 0.075;

        draw.rect()
            .x_y(0.0, 0.0)
            .w_h(12.0 - (f * 4.0), 12.0 - (f * 4.0))
            .color(rgb(c, c, c));
    }
}
