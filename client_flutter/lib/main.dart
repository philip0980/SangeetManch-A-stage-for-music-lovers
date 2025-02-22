import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:audioplayers/audioplayers.dart'; // Import the audioplayers package

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
      appBar: AppBar(title: const Text('Music App')),
      body: const FetchDataPage(),
    );
  }
}

class FetchDataPage extends StatefulWidget {
  const FetchDataPage({super.key});

  @override
  State<FetchDataPage> createState() => _FetchDataPageState();
}

class _FetchDataPageState extends State<FetchDataPage> {
  late Future<List<Song>> futureSongs;
  final AudioPlayer _audioPlayer =
      AudioPlayer(); // Create an AudioPlayer instance

  @override
  void initState() {
    super.initState();
    futureSongs = fetchSongs();
  }

  Future<List<Song>> fetchSongs() async {
    final response = await http.get(
      Uri.parse('http://localhost:8000/api/v1/song/all-songs'),
    );

    if (response.statusCode == 200) {
      // Parse the JSON response
      Map<String, dynamic> data = json.decode(response.body);

      if (data['songs'] == null) {
        return []; // Return an empty list if 'songs' is null
      }

      List<dynamic> songList = data['songs'];

      return songList.map((json) => Song.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load songs');
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Song>>(
      future: futureSongs,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Center(child: Text('Error: ${snapshot.error}'));
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text('No songs found.'));
        } else {
          // Display the list of songs
          return ListView.builder(
            itemCount: snapshot.data!.length,
            itemBuilder: (context, index) {
              final song = snapshot.data![index];
              return ListTile(
                leading: Image.network(
                  song.coverImageUrl,
                ), // Display cover image
                title: Text(song.title),
                subtitle: Text(song.artist),
                onTap: () async {
                  // Play the song when it's tapped
                  await _audioPlayer.play(UrlSource(song.fileUrl));
                  print('Playing song: ${song.title}');
                },
              );
            },
          );
        }
      },
    );
  }
}

class Song {
  final String id;
  final String title;
  final String artist;
  final String album;
  final String genre;
  final int duration;
  final String fileUrl;
  final String coverImageUrl;

  Song({
    required this.id,
    required this.title,
    required this.artist,
    required this.album,
    required this.genre,
    required this.duration,
    required this.fileUrl,
    required this.coverImageUrl,
  });

  factory Song.fromJson(Map<String, dynamic> json) {
    return Song(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      artist: json['artist'] ?? '',
      album: json['album'] ?? '',
      genre: json['genre'] ?? '',
      duration: json['duration'] ?? 0,
      fileUrl: json['fileUrl'] ?? '',
      coverImageUrl: json['coverImageUrl'] ?? '',
    );
  }
}
