import 'dart:convert';
import 'package:client_flutter/music_player_screen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePage extends StatefulWidget {
  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  Map<String, dynamic>? user;
  List<dynamic> mySongs = [];

  Future<Map<String, dynamic>> _fetchProfileAndSongs() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) throw Exception("No token found");

    final profileUrl = Uri.parse("http://10.0.2.2:8000/api/v1/user/profile");
    final songsUrl = Uri.parse("http://10.0.2.2:8000/api/v1/song/my-song");

    final profileRes = await http.get(
      profileUrl,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    final songsRes = await http.get(
      songsUrl,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (profileRes.statusCode == 200 && songsRes.statusCode == 200) {
      final profileData = json.decode(profileRes.body);
      final songsData = json.decode(songsRes.body);

      return {'user': profileData['user'], 'songs': songsData['songs']};
    } else {
      throw Exception("Failed to fetch data");
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchProfileAndSongs();
  }

  Future<void> _deleteAccount(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final url = Uri.parse("http://10.0.2.2:8000/api/v1/user/delete-account");

    final confirm = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            title: Text("Confirm Deletion"),
            content: Text("Are you sure you want to delete your account?"),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: Text("Cancel"),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                child: Text("Delete", style: TextStyle(color: Colors.red)),
              ),
            ],
          ),
    );

    if (confirm != true) return;

    String? password = await showDialog<String>(
      context: context,
      builder: (context) {
        final TextEditingController _passwordController =
            TextEditingController();
        return AlertDialog(
          title: Text("Enter Password"),
          content: TextField(
            controller: _passwordController,
            obscureText: true,
            decoration: InputDecoration(labelText: "Password"),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, _passwordController.text),
              child: Text("Confirm"),
            ),
          ],
        );
      },
    );

    if (password == null || password.isEmpty) return;

    final request = http.Request('DELETE', url);
    request.headers.addAll({
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    });
    request.body = jsonEncode({'password': password});

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      await prefs.clear();
      Navigator.pushReplacementNamed(context, '/login');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to delete account: ${response.body}")),
      );
    }
  }

  void _handleMenu(String value) {
    switch (value) {
      case 'upload':
        Navigator.pushNamed(context, '/upload-song');
        break;
      case 'change_password':
        Navigator.pushNamed(context, '/change-password');
        break;
      case 'delete':
        _deleteAccount(context);
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: _fetchProfileAndSongs(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text("Error: ${snapshot.error}"));
        } else if (snapshot.hasData) {
          final user = snapshot.data!["user"];
          final songs = snapshot.data!["songs"];

          return SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 40),
                Stack(
                  alignment: Alignment.topRight,
                  children: [
                    Center(
                      child: CircleAvatar(
                        radius: 60,
                        backgroundImage: NetworkImage(user["avatar"]["url"]),
                      ),
                    ),
                    Positioned(
                      right: 10,
                      top: -10,
                      child: PopupMenuButton<String>(
                        onSelected: _handleMenu,
                        icon: Icon(Icons.more_vert, color: Colors.black87),
                        itemBuilder:
                            (context) => [
                              PopupMenuItem(
                                value: 'upload',
                                child: ListTile(
                                  leading: Icon(
                                    Icons.upload,
                                    color: Colors.green,
                                  ),
                                  title: Text("Upload Song"),
                                ),
                              ),
                              PopupMenuItem(
                                value: 'change_password',
                                child: ListTile(
                                  leading: Icon(
                                    Icons.lock,
                                    color: Colors.orange,
                                  ),
                                  title: Text("Change Password"),
                                ),
                              ),
                              PopupMenuItem(
                                value: 'delete',
                                child: ListTile(
                                  leading: Icon(
                                    Icons.delete_forever,
                                    color: Colors.red,
                                  ),
                                  title: Text("Delete Account"),
                                ),
                              ),
                            ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  user["name"] ?? "N/A",
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                Text(
                  user["email"] ?? "N/A",
                  style: TextStyle(fontSize: 16, color: Colors.grey[700]),
                ),
                const SizedBox(height: 20),
                Card(
                  margin: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 4,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ProfileRow(label: "Role", value: user["role"]),
                        ProfileRow(
                          label: "Banned",
                          value: user["isBanned"] ? "Yes" : "No",
                        ),
                        if (user["isBanned"] &&
                            user["banReason"].trim().isNotEmpty)
                          ProfileRow(
                            label: "Ban Reason",
                            value: user["banReason"],
                          ),
                        if (user["suspensionEnd"] != null)
                          ProfileRow(
                            label: "Suspended Until",
                            value: user["suspensionEnd"],
                          ),
                        if ((user["suspensionReason"] ?? "").trim().isNotEmpty)
                          ProfileRow(
                            label: "Suspension Reason",
                            value: user["suspensionReason"],
                          ),
                        ProfileRow(
                          label: "Joined",
                          value: user["createdAt"].substring(0, 10),
                        ),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 10,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "My Uploaded Songs",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),

                      // 🟡 Handle "no songs" case
                      if (songs.isEmpty)
                        Text("You haven't uploaded any songs yet.")
                      else
                        ...songs.map<Widget>((song) {
                          return ListTile(
                            leading:
                                song["coverImageUrl"] != null
                                    ? ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        song["coverImageUrl"],
                                        width: 50,
                                        height: 50,
                                        fit: BoxFit.cover,
                                      ),
                                    )
                                    : Icon(Icons.music_note),
                            title: Text(song["title"] ?? "Untitled"),
                            subtitle: Text(
                              "Genre: ${song["genre"] ?? 'Unknown'}",
                            ),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder:
                                      (context) => MusicPlayerScreen(
                                        song: song,
                                        songs: songs,
                                      ),
                                ),
                              );
                            },
                          );
                        }).toList(),
                    ],
                  ),
                ),
              ],
            ),
          );
        } else {
          return Center(child: Text("No profile data available"));
        }
      },
    );
  }
}

class ProfileRow extends StatelessWidget {
  final String label;
  final String value;

  const ProfileRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        children: [
          Text("$label:", style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: Colors.black87),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
