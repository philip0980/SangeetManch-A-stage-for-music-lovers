import 'dart:io';

class Config {
  static String get baseUrl {
    // Use local server only if you're running on Android emulator
    bool isLocal =
        Platform.isAndroid && !bool.fromEnvironment("dart.vm.product");

    return isLocal
        ? "http://10.0.2.2:8000" // Android emulator (localhost)
        : "https://nistha.onrender.com"; // Production
  }
}
