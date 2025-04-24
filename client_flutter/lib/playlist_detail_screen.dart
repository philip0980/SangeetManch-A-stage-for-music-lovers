import 'dart:convert';
import 'package:client_flutter/base_url.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'music_player_screen.dart'; // your music player

class PlaylistDetailScreen extends StatefulWidget {
  final Map<String, dynamic> playlist;

  const PlaylistDetailScreen({super.key, required this.playlist});

  @override
  State<PlaylistDetailScreen> createState() => _PlaylistDetailScreenState();
}

class _PlaylistDetailScreenState extends State<PlaylistDetailScreen> {
  List<dynamic> songs = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchSongs();
  }

  Future<void> fetchSongs() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      print('No token found');
      return;
    }

    try {
      final response = await http.get(
        Uri.parse(Config.baseUrl + '/api/v1/song/all-songs'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final allSongs = jsonDecode(response.body)['songs'] ?? [];

        final playlistSongIds = List<String>.from(widget.playlist['songs']);

        songs =
            allSongs.where((song) {
              final songId = song['_id'].toString();
              return playlistSongIds.contains(songId);
            }).toList();
      }
    } catch (e) {
      print('Error fetching songs: $e');
    }

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.playlist['name'] ?? 'Playlist'),
        backgroundColor: Color(0xFF1e1e2f),
        foregroundColor: Colors.white,
      ),
      backgroundColor: Color(0xFFF6F8FA),
      body:
          isLoading
              ? Center(child: CircularProgressIndicator())
              : songs.isEmpty
              ? Center(child: Text('No songs found in this playlist'))
              : ListView.builder(
                padding: const EdgeInsets.all(10),
                itemCount: songs.length,
                itemBuilder: (context, index) {
                  final song = songs[index];

                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                    elevation: 4,
                    child: ListTile(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) =>
                                    MusicPlayerScreen(song: song, songs: songs),
                          ),
                        );
                      },
                      leading: CircleAvatar(
                        backgroundImage:
                            song['coverImageUrl'] != null
                                ? NetworkImage(song['coverImageUrl'])
                                : AssetImage('assets/default-music.png')
                                    as ImageProvider,
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
                },
              ),
    );
  }
}
