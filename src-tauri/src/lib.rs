use std::path::PathBuf;
use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::Manager;

struct Servidor(Mutex<Option<Child>>);

fn matar_hijo(handle: &tauri::AppHandle) {
    let state: tauri::State<Servidor> = handle.state();
    if let Ok(mut guardia) = state.0.try_lock() {
        if let Some(ref mut child) = *guardia {
            let _ = child.kill();
        }
    };
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|a| {
            let hijo = if cfg!(debug_assertions) {
                let manifest = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
                let ruta = manifest.parent().unwrap().join("express");
                Command::new("bun")
                    .args(["run", "src/index.ts"])
                    .current_dir(&ruta)
                    .spawn()
                    .ok()
            } else {
                let exe = std::env::current_exe().unwrap();
                let exe_dir = exe.parent().unwrap().to_path_buf();
                let servidor = exe_dir.join("servidor");
                Command::new(&servidor)
                    .current_dir(&exe_dir)
                    .spawn()
                    .ok()
            };

            a.manage(Servidor(Mutex::new(hijo)));
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error building tauri application");

    let handle = app.handle().clone();
    app.run(move |_handle, evento| {
        if let tauri::RunEvent::Exit = evento {
            matar_hijo(&handle);
        }
    });
}
