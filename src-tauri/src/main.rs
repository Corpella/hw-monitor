// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use libloading::Library;
use std::{
    ffi::{CStr, CString},
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
};
use tauri::{Manager, State, Window};
struct AppState {
    lib: Arc<Library>,
    thread_handle: Mutex<Option<std::thread::JoinHandle<()>>>,
    should_stop: Arc<AtomicBool>,
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
fn stop_process(state: State<AppState>) -> Result<(), String> {
    let mut thread_handle = state.thread_handle.lock().map_err(|e| e.to_string())?;
    if let Some(handle) = thread_handle.take() {
        state.should_stop.store(true, Ordering::SeqCst);
        handle
            .join()
            .map_err(|_| "Failed to join thread".to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn init_process(
    hardware_type: String,
    polling_rate: u64,
    window: Window,
    state: State<AppState>,
) -> Result<(), String> {
    // Stop the existing process if it's running
    stop_process(state.clone())?;

    let lib = Arc::clone(&state.lib);
    let should_stop = Arc::clone(&state.should_stop);
    should_stop.store(false, Ordering::SeqCst);

    let handle = std::thread::spawn(move || {
        while !should_stop.load(Ordering::SeqCst) {
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
        }
    });

    let mut thread_handle = state.thread_handle.lock().map_err(|e| e.to_string())?;
    *thread_handle = Some(handle);

    Ok(())
}
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let lib = unsafe { Library::new("./native-library/WindowsMonitor.dll")? };
            let state = AppState {
                lib: Arc::new(lib),
                thread_handle: Mutex::new(None),
                should_stop: Arc::new(AtomicBool::new(false)),
            };
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![init_process, stop_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
