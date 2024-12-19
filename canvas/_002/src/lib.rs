use async_std::task::block_on;
use wasm_bindgen::prelude::wasm_bindgen;

mod sketch;
use sketch::run_app;

#[wasm_bindgen]
pub async fn main() {
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    block_on(async {
        run_app().await;
    });
}
