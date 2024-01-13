fn main() {
    println!("cargo:rustc-link-search=native=./native-library");
    println!("cargo:rustc-link-lib=WindowsMonitor");
    tauri_build::build()
}
