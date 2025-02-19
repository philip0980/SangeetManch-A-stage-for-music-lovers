import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const Music(),
    );
  }
}

class Music extends StatelessWidget {
  const Music({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: Padding(
          padding: EdgeInsets.only(left: 12.0, top: 12, bottom: 12),
          child: Text(
            "Music",
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
        ),
        actions: [
          Padding(
            padding: EdgeInsets.all(12.0),
            child: Text(
              "Profile",
              style: TextStyle(color: Colors.white, fontSize: 18),
            ),
          ),
        ],
        backgroundColor: Colors.blue,
      ),
    );
  }
}
