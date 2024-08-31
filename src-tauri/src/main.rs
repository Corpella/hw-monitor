// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::ffi::CStr;
use std::ffi::CString;

// use std::{thread::sleep, time::Duration};
use tauri::Manager;

// extern "C" {
//     fn GetHardwareInfo(key: *const i8) -> *const i8;
// }

fn call_dynamic(key: *const i8) -> Result<*const i8, Box<dyn std::error::Error>> {
    print!("Enter function declaration");
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
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // let polling_rate: u64 = 2000;
            let id = app.listen_global("start_monitoring", |event| {
                println!("got event-name with payload {:?}", event.payload());
                // polling_rate = event.payload()
            });

            app.unlisten(id);
            // TODO: send result of this method
            unsafe {
                let c_string = CString::new("Cpu,GpuNvidia").unwrap();

                // let result = GetHardwareInfo(c_string.as_ptr());
                let result = call_dynamic(c_string.as_ptr()).unwrap();
                println!("{:?}", CStr::from_ptr(result))
            };
            //     app.emit_all(
            //         "event-name",
            //         Payload {
            //             message: "Tauri is awesome!".into(),
            //         },
            //     )

            // std::thread::spawn(move || {
            // loop {
            //     // Replace this with your data to send to the frontend
            //     let data = "Your data to send";

            //     app.emit_all(
            //         "event-name",
            //         Payload {
            //             message: "Tauri is awesome!".into(),
            //         },
            //     )
            //     .unwrap();

            //     // Sleep for 1 second
            //     sleep(Duration::from_millis(polling_rate));
            // }
            // });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
