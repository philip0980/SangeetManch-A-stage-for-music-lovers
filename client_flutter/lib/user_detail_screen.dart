import 'dart:convert';
import 'package:client_flutter/base_url.dart';
import 'package:client_flutter/music_player_screen.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class UserDetailScreen extends StatefulWidget {
  final Map<String, dynamic> user;

  const UserDetailScreen({super.key, required this.user});

  @override
  State<UserDetailScreen> createState() => _UserDetailScreenState();
}

class _UserDetailScreenState extends State<UserDetailScreen> {
  Map<String, dynamic>? userDetails;
  List<dynamic> userSongs = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchUserDetails();
  }

  Future<void> fetchUserDetails() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      print('No token found');
      return;
    }

    try {
      final userResponse = await http.get(
        Uri.parse(
          Config.baseUrl + '/api/v1/user/single-user/${widget.user["_id"]}',
        ),
        headers: {'Authorization': 'Bearer $token'},
      );

      final songResponse = await http.get(
        Uri.parse(
          Config.baseUrl + '/api/v1/song/their-song/${widget.user["_id"]}',
        ),
        headers: {'Authorization': 'Bearer $token'},
      );

      setState(() {
        userDetails = jsonDecode(userResponse.body)['user'];
        userSongs = jsonDecode(songResponse.body)['songs'] ?? [];
        isLoading = false;
      });
    } catch (e) {
      print('Error fetching user details: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> suspendUser() async {
    String reason = '';
    String duration = '';

    await showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: Text('Suspend User'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  decoration: InputDecoration(labelText: 'Reason'),
                  onChanged: (value) => reason = value,
                ),
                TextField(
                  decoration: InputDecoration(labelText: 'Duration (in days)'),
                  onChanged: (value) => duration = value,
                  keyboardType: TextInputType.number,
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () async {
                  final prefs = await SharedPreferences.getInstance();
                  final token = prefs.getString('token');

                  if (token != null) {
                    try {
                      final response = await http.post(
                        Uri.parse(
                          Config.baseUrl +
                              '/api/v1/user/suspend/${widget.user["_id"]}',
                        ),
                        headers: {
                          'Authorization': 'Bearer $token',
                          'Content-Type': 'application/json',
                        },
                        body: jsonEncode({
                          'reason': reason,
                          'duration': duration,
                        }),
                      );

                      if (response.statusCode == 200) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('User suspended successfully'),
                          ),
                        );
                      } else {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Failed to suspend user')),
                        );
                      }
                    } catch (e) {
                      print('Error suspending user: $e');
                    }
                  }
                },
                child: Text('Suspend'),
              ),
            ],
          ),
    );
  }

  Future<void> banUser() async {
    String adminPassword = '';

    await showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: Text('Ban User'),
            content: TextField(
              decoration: InputDecoration(labelText: 'Admin Password'),
              obscureText: true,
              onChanged: (value) => adminPassword = value,
            ),
            actions: [
              TextButton(
                onPressed: () async {
                  final prefs = await SharedPreferences.getInstance();
                  final token = prefs.getString('token');

                  if (token != null) {
                    try {
                      final response = await http.post(
                        Uri.parse(
                          Config.baseUrl +
                              '/api/v1/user/ban/${widget.user["_id"]}',
                        ),
                        headers: {
                          'Authorization': 'Bearer $token',
                          'Content-Type': 'application/json',
                        },
                        body: jsonEncode({'adminPassword': adminPassword}),
                      );

                      if (response.statusCode == 200) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('User banned successfully')),
                        );
                      } else {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Failed to ban user')),
                        );
                      }
                    } catch (e) {
                      print('Error banning user: $e');
                    }
                  }
                },
                child: Text('Ban'),
              ),
            ],
          ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('User Details'),
        backgroundColor: Color(0xFF1e1e2f),
        foregroundColor: Colors.white,
      ),
      body:
          isLoading
              ? Center(child: CircularProgressIndicator())
              : SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    CircleAvatar(
                      backgroundImage:
                          userDetails?['avatar']?['url'] != null
                              ? NetworkImage(userDetails!['avatar']['url'])
                              : AssetImage('assets/default-user.png')
                                  as ImageProvider,
                      radius: 50,
                    ),
                    SizedBox(height: 20),
                    Text(
                      userDetails?['email'] ?? 'No Email',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Role: ${userDetails?['role'] ?? 'User'}',
                      style: TextStyle(fontSize: 16),
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton(
                          onPressed: suspendUser,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(
                              0xFF42A5F5,
                            ), // Warm Amber color
                            foregroundColor: Colors.white, // Text color
                            padding: EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                          child: Text(
                            'Suspend User',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        ElevatedButton(
                          onPressed: banUser,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(
                              0xFFFF5722,
                            ), // Strong Red color
                            foregroundColor: Colors.white, // Text color
                            padding: EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                          child: Text(
                            'Ban User',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),

                    Divider(height: 40, thickness: 2),
                    Text(
                      'Songs Uploaded',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    ...userSongs.map(
                      (song) => Card(
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        child: ListTile(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder:
                                    (context) => MusicPlayerScreen(
                                      song: song,
                                      songs: userSongs,
                                    ),
                              ),
                            );
                          },
                          leading: CircleAvatar(
                            backgroundImage:
                                song['coverImageUrl'] != null
                                    ? NetworkImage(song['coverImageUrl'])
                                    : AssetImage('assets/default-music.png')
                                        as ImageProvider,
                          ),
                          title: Text(song['title'] ?? 'No Title'),
                          subtitle: Text(
                            'Artist: ${song['artist'] ?? 'Unknown'}',
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
    );
  }
}
