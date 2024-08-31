// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::ffi::CStr;
use std::ffi::CString;

use tauri::Window;

// extern "C" {
//     fn GetHardwareInfo(key: *const i8) -> *const i8;
// }

fn call_dynamic(key: *const i8) -> Result<*const i8, Box<dyn std::error::Error>> {
    unsafe {
        let lib = libloading::Library::new("./native-library/WindowsMonitor.dll")?;
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
fn init_process(polling_rate: u64, window: Window) {
    std::thread::spawn(move || loop {
        let c_string = CString::new("Cpu,GpuNvidia").unwrap();

        // let result = GetHardwareInfo(c_string.as_ptr());
        let result = call_dynamic(c_string.as_ptr()).unwrap();

        let c_str = unsafe { CStr::from_ptr(result) };
        let rust_string = c_str.to_str().unwrap().to_owned();
        // println!("{:?}", rust_string);
        window
            .emit(
                "monitoring_data",
                Payload {
                    message: rust_string.into(),
                },
            )
            .unwrap();
        std::thread::sleep(std::time::Duration::from_secs(polling_rate));
    });
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // let main_window = app.get_window("main").unwrap();
            // let polling_rate: u64 = 2000;
            // let id = app.listen_global("start-monitoring", |event| {
            //     println!("got event-name with payload {:?}", event.payload());
            // });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![init_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
