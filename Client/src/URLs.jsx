let BASE_URL = "";

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  // 👇 If you're testing on Android emulator
  // BASE_URL = "http://10.0.2.2:8000";

  // 👇 If you're testing in web browser on your PC
  BASE_URL = "http://localhost:8000";
} else {
  BASE_URL = "https://nistha.onrender.com";
}

export { BASE_URL };
