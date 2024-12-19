use async_std::task::block_on;

mod sketch;
use sketch::run_app;

fn main() {
    block_on(async {
        run_app().await;
    });
}
