import 'package:flutter/material.dart';

Widget getSongCard(Map<String, dynamic> e) {
  return Padding(
    padding: const EdgeInsets.all(8.0),
    child: ListTile(
      leading: Row(
        children: [
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: Image.network(
              e["coverImageUrl"].toString(),
              width: 80,
              height: 80,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 10), // Space between image and text
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                e["title"],
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(e["artist"]),
              Text(e["album"]),
            ],
          ),
        ],
      ),
    ),
  );
}
