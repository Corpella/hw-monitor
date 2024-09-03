// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use libloading::Library;
use std::{
    ffi::{CStr, CString},
    sync::Arc,
};
use tauri::{Manager, State, Window};
struct AppState {
    lib: Arc<Library>,
}

fn call_dynamic(lib: &Library, key: *const i8) -> Result<*const i8, Box<dyn std::error::Error>> {
    unsafe {
        let func: libloading::Symbol<unsafe extern "C" fn(key: *const i8) -> *const i8> =
            lib.get(b"GetHardwareInfo")?;
        Ok(func(key))
    }
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[tauri::command]
fn init_process(hardware_type: &str, polling_rate: u64, window: Window, state: State<AppState>) {
    let hardware_type = hardware_type.to_string();
    let lib = Arc::clone(&state.lib);
    std::thread::spawn(move || loop {
        let c_string = CString::new(hardware_type.clone()).unwrap();

        let result = call_dynamic(&lib, c_string.as_ptr()).unwrap();
        let c_str = unsafe { CStr::from_ptr(result) };
        let rust_string = c_str.to_str().unwrap().to_owned();
        window
            .emit(
                "monitoring_data",
                Payload {
                    message: rust_string,
                },
            )
            .unwrap();
        std::thread::sleep(std::time::Duration::from_secs(polling_rate));
    });
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let lib = unsafe { Library::new("./native-library/WindowsMonitor.dll")? };
            let state = AppState { lib: Arc::new(lib) };
            app.manage(state);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![init_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
