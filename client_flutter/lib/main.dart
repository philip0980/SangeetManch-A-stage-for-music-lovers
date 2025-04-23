import 'package:client_flutter/change_password.dart';
import 'package:client_flutter/dashboard_screen.dart';
import 'package:client_flutter/login.dart';
import 'package:client_flutter/profile.dart';
import 'package:client_flutter/register.dart';
import 'package:client_flutter/setting.dart';
import 'package:client_flutter/song-list-screen.dart';
import 'package:client_flutter/upload_song_screen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Music Player",
      debugShowCheckedModeBanner: false,
      initialRoute: '/login', // Start with login screen
      routes: {
        '/login': (context) => Login(),
        '/register': (context) => Register(),
        '/main': (context) => MainScreen(), // Main app screen
        '/dashboard': (context) => DashboardScreen(), // Dashboard screen
        '/upload-song': (context) => UploadSongScreen(),
        '/change-password': (context) => ResetPasswordScreen(),
      },
    );
  }
}

class MainScreen extends StatefulWidget {
  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  bool _isLoggedIn = false;
  String? _role; // To store the role

  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final role = prefs.getString('role'); // Fetch role too

    setState(() {
      _isLoggedIn = token != null;
      _role = role;
    });
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) return;

    final url = Uri.parse("http://10.0.2.2:8000/api/v1/user/logout");

    try {
      final response = await http.post(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        await prefs.remove('token');
        await prefs.remove('role'); // remove role on logout too
        setState(() {
          _isLoggedIn = false;
          _role = null;
        });

        Navigator.pushReplacementNamed(context, '/login');
      } else {
        print("Logout failed: ${response.body}");
      }
    } catch (e) {
      print("Logout error: $e");
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> _pages = [SongListScreen(), ProfilePage(), SettingsPage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Padding(
          padding: const EdgeInsets.only(left: 10.0),
          child: Image.asset('assets/images/logo2.png', height: 35),
        ),
        backgroundColor: Color(0xFF1e1e2f),
        foregroundColor: const Color.fromARGB(255, 214, 206, 206),
        actions: [
          if (_isLoggedIn && _role == 'admin') // Only for admin
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: GestureDetector(
                child: Text("Dashboard"),
                onTap: () {
                  Navigator.pushNamed(context, '/dashboard');
                },
              ),
            ),
          _isLoggedIn
              ? Padding(
                padding: const EdgeInsets.all(8.0),
                child: GestureDetector(child: Text("Logout"), onTap: _logout),
              )
              : Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: GestureDetector(
                      child: Text("Login"),
                      onTap: () {
                        Navigator.of(context).pushNamed('/login');
                      },
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: GestureDetector(
                      child: Text("Register"),
                      onTap: () {
                        Navigator.of(context).pushNamed('/register');
                      },
                    ),
                  ),
                ],
              ),
        ],
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.music_note), label: 'Songs'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
        selectedItemColor: Color(0xFF1e1e2f),
        unselectedItemColor: Colors.grey,
      ),
    );
  }
}
