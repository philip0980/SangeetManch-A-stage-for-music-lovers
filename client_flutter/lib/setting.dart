// Settings Page
import 'package:flutter/material.dart';

class SettingsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Settings")),
      body: ListView(
        children: [
          ListTile(
            title: Text("Theme"),
            subtitle: Text("Change app theme"),
            onTap: () {
              // Navigate to theme settings
            },
          ),
          ListTile(
            title: Text("Notifications"),
            subtitle: Text("Manage notifications"),
            onTap: () {
              // Navigate to notification settings
            },
          ),
        ],
      ),
    );
  }
}
