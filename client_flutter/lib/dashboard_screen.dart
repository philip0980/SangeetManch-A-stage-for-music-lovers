import 'dart:convert';
import 'package:client_flutter/base_url.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

// Import screens
import 'user_detail_screen.dart';
import 'music_player_screen.dart';
import 'playlist_detail_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  List<dynamic> users = [];
  List<dynamic> songs = [];
  List<dynamic> playlists = [];

  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchDashboardData();
  }

  Future<void> fetchDashboardData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      print('No token found');
      return;
    }

    try {
      final usersResponse = await http.get(
        Uri.parse(Config.baseUrl + '/api/v1/user/all-users'),
        headers: {'Authorization': 'Bearer $token'},
      );

      final songsResponse = await http.get(
        Uri.parse(Config.baseUrl + '/api/v1/song/all-songs'),
        headers: {'Authorization': 'Bearer $token'},
      );

      final playlistsResponse = await http.get(
        Uri.parse(Config.baseUrl + '/api/v1/playlist/find-playlist'),
        headers: {'Authorization': 'Bearer $token'},
      );

      setState(() {
        users = jsonDecode(usersResponse.body)['users'] ?? [];
        songs = jsonDecode(songsResponse.body)['songs'] ?? [];
        playlists = jsonDecode(playlistsResponse.body)['playlist'] ?? [];
        isLoading = false;
      });
    } catch (e) {
      print('Error fetching dashboard data: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  Widget _buildUserCard(Map<String, dynamic> user) {
    return Card(
      margin: const EdgeInsets.all(8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      elevation: 4,
      child: ListTile(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => UserDetailScreen(user: user),
            ),
          );
        },
        leading: CircleAvatar(
          backgroundImage:
              user["avatar"]["url"] != null
                  ? NetworkImage(user["avatar"]["url"])
                  : AssetImage('assets/default-user.png') as ImageProvider,
          radius: 25,
        ),
        title: Text(
          user['email'] ?? 'No Email',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(user['role'] ?? 'User'),
        trailing: Icon(Icons.arrow_forward_ios),
      ),
    );
  }

  Widget _buildSongCard(Map<String, dynamic> song) {
    return Card(
      margin: const EdgeInsets.all(8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      elevation: 4,
      child: ListTile(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => MusicPlayerScreen(song: song, songs: songs),
            ),
          );
        },
        leading: CircleAvatar(
          backgroundImage:
              song['coverImageUrl'] != null
                  ? NetworkImage(song['coverImageUrl'])
                  : AssetImage('assets/default-music.png') as ImageProvider,
          radius: 25,
        ),
        title: Text(
          song['title'] ?? 'No Title',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text('Artist: ${song['artist'] ?? 'Unknown'}'),
        trailing: Icon(Icons.play_arrow),
      ),
    );
  }

  Widget _buildPlaylistCard(Map<String, dynamic> playlist) {
    return Card(
      margin: const EdgeInsets.all(8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      elevation: 4,
      child: ListTile(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => PlaylistDetailScreen(playlist: playlist),
            ),
          );
        },
        leading: Icon(Icons.playlist_play, color: Colors.blueAccent, size: 35),
        title: Text(
          playlist['name'] ?? 'No Name',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text('Total Songs: ${playlist['songs']?.length ?? 0}'),
        trailing: Icon(Icons.arrow_forward_ios),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(12.0),
          child: Text(
            title,
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
          ),
        ),
        ...items,
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF6F8FA),
      appBar: AppBar(
        title: Text("Admin Dashboard"),
        backgroundColor: Color(0xFF1e1e2f),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body:
          isLoading
              ? Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                onRefresh: fetchDashboardData,
                child: SingleChildScrollView(
                  physics: AlwaysScrollableScrollPhysics(),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 10,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSection(
                          'Users',
                          users.map((u) => _buildUserCard(u)).toList(),
                        ),
                        Divider(height: 30, thickness: 2),
                        _buildSection(
                          'Songs',
                          songs.map((s) => _buildSongCard(s)).toList(),
                        ),
                        Divider(height: 30, thickness: 2),
                        _buildSection(
                          'Playlist',
                          playlists.map((p) => _buildPlaylistCard(p)).toList(),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
    );
  }
}
