import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart' as p;
import 'package:client_flutter/base_url.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UploadSongScreen extends StatefulWidget {
  @override
  _UploadSongScreenState createState() => _UploadSongScreenState();
}

class _UploadSongScreenState extends State<UploadSongScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _artistController = TextEditingController();
  final TextEditingController _albumController = TextEditingController();
  final TextEditingController _genreController = TextEditingController();
  final TextEditingController _durationController = TextEditingController();

  File? _audioFile;
  File? _coverImage;

  bool _isUploading = false;

  Future<File?> _pickFile({
    required FileType type,
    List<String>? extensions,
  }) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: type,
      allowedExtensions: extensions,
    );
    if (result != null && result.files.single.path != null) {
      return File(result.files.single.path!);
    }
    return null;
  }

  Future<void> _pickAudioFile() async {
    File? file = await _pickFile(
      type: FileType.custom,
      extensions: ['mp3', 'wav', 'aac'],
    );
    if (file != null) {
      setState(() {
        _audioFile = file;
      });
    }
  }

  Future<void> _pickCoverImage() async {
    File? file = await _pickFile(type: FileType.image);
    if (file != null) {
      setState(() {
        _coverImage = file;
      });
    }
  }

  Future<void> _uploadSong() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (_formKey.currentState!.validate() &&
        _audioFile != null &&
        _coverImage != null) {
      setState(() {
        _isUploading = true;
      });

      try {
        var uri = Uri.parse('${Config.baseUrl}/api/v1/song/upload');
        var request = http.MultipartRequest('POST', uri);
        request.headers['Authorization'] = 'Bearer $token';

        request.fields['title'] = _titleController.text;
        request.fields['artist'] = _artistController.text;
        request.fields['album'] = _albumController.text;
        request.fields['genre'] = _genreController.text;
        request.fields['duration'] = _durationController.text;

        request.files.add(
          await http.MultipartFile.fromPath('fileUrl', _audioFile!.path),
        );
        request.files.add(
          await http.MultipartFile.fromPath('coverImageUrl', _coverImage!.path),
        );

        var response = await request.send();
        final responseBody = await response.stream.bytesToString();

        if (!mounted) return;

        setState(() {
          _isUploading = false;
        });

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Song uploaded successfully')));
          Navigator.pop(context);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Upload failed: $responseBody')),
          );
        }
      } catch (e) {
        setState(() {
          _isUploading = false;
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please fill in all fields and select files')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Upload Song')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            if (_isUploading) LinearProgressIndicator(),
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _titleController,
                    decoration: InputDecoration(labelText: 'Song Title'),
                    validator: (value) => value!.isEmpty ? 'Enter title' : null,
                  ),
                  TextFormField(
                    controller: _artistController,
                    decoration: InputDecoration(labelText: 'Artist'),
                    validator:
                        (value) => value!.isEmpty ? 'Enter artist' : null,
                  ),
                  TextFormField(
                    controller: _albumController,
                    decoration: InputDecoration(labelText: 'Album'),
                  ),
                  TextFormField(
                    controller: _genreController,
                    decoration: InputDecoration(labelText: 'Genre'),
                  ),
                  TextFormField(
                    controller: _durationController,
                    decoration: InputDecoration(
                      labelText: 'Duration (e.g., 3:45)',
                    ),
                  ),
                  SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: _isUploading ? null : _pickAudioFile,
                    icon: Icon(Icons.audiotrack),
                    label: Text(
                      _audioFile != null ? 'Audio Selected' : 'Pick Audio File',
                    ),
                  ),
                  SizedBox(height: 10),
                  ElevatedButton.icon(
                    onPressed: _isUploading ? null : _pickCoverImage,
                    icon: Icon(Icons.image),
                    label: Text(
                      _coverImage != null
                          ? 'Image Selected'
                          : 'Pick Cover Image',
                    ),
                  ),
                  SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: _isUploading ? null : _uploadSong,
                    child: Text('Upload Song'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
