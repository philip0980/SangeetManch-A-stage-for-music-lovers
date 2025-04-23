import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'package:path/path.dart';

class UploadSongScreen extends StatefulWidget {
  @override
  _UploadSongScreenState createState() => _UploadSongScreenState();
}

class _UploadSongScreenState extends State<UploadSongScreen> {
  final _formKey = GlobalKey<FormState>();

  TextEditingController _titleController = TextEditingController();
  TextEditingController _artistController = TextEditingController();
  TextEditingController _albumController = TextEditingController();
  TextEditingController _genreController = TextEditingController();
  TextEditingController _durationController = TextEditingController();

  File? _audioFile;
  File? _coverImage;

  // Function to pick audio file
  Future<void> _pickAudioFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['mp3', 'wav', 'aac'],
    );

    if (result != null && result.files.single.path != null) {
      setState(() {
        _audioFile = File(result.files.single.path!);
      });
    }
  }

  // Function to pick cover image
  Future<void> _pickCoverImage() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.image,
    );

    if (result != null && result.files.single.path != null) {
      setState(() {
        _coverImage = File(result.files.single.path!);
      });
    }
  }

  // Function to upload the song details
  Future<void> _uploadSong() async {
    if (_formKey.currentState!.validate() &&
        _audioFile != null &&
        _coverImage != null) {
      var uri = Uri.parse("http://10.0.2.2:8000/api/v1/song/upload");

      var request = http.MultipartRequest('POST', uri);

      // Add text fields
      request.fields['title'] = _titleController.text;
      request.fields['artist'] = _artistController.text;
      request.fields['album'] = _albumController.text;
      request.fields['genre'] = _genreController.text;
      request.fields['duration'] = _durationController.text;

      // Add audio file
      var audioStream = http.MultipartFile(
        'audio',
        _audioFile!.openRead(),
        await _audioFile!.length(),
        filename: basename(_audioFile!.path),
      );
      request.files.add(audioStream);

      // Add cover image
      var coverImageStream = http.MultipartFile(
        'coverImage',
        _coverImage!.openRead(),
        await _coverImage!.length(),
        filename: basename(_coverImage!.path),
      );
      request.files.add(coverImageStream);

      // Send request
      var response = await request.send();

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(
          context as BuildContext,
        ).showSnackBar(SnackBar(content: Text('Song uploaded successfully')));
        Navigator.pop(
          context as BuildContext,
        ); // Go back to the previous screen
      } else {
        ScaffoldMessenger.of(
          context as BuildContext,
        ).showSnackBar(SnackBar(content: Text('Failed to upload song')));
      }
    } else {
      ScaffoldMessenger.of(context as BuildContext).showSnackBar(
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
        child: Form(
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
                validator: (value) => value!.isEmpty ? 'Enter artist' : null,
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
                decoration: InputDecoration(labelText: 'Duration (e.g., 3:45)'),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: _pickAudioFile,
                icon: Icon(Icons.audiotrack),
                label: Text(
                  _audioFile != null ? 'Audio Selected' : 'Pick Audio File',
                ),
              ),
              const SizedBox(height: 10),
              ElevatedButton.icon(
                onPressed: _pickCoverImage,
                icon: Icon(Icons.image),
                label: Text(
                  _coverImage != null ? 'Image Selected' : 'Pick Cover Image',
                ),
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _uploadSong,
                child: Text('Upload Song'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
