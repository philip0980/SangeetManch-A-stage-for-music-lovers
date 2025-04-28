// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:permission_handler/permission_handler.dart';

// Future<void> requestPermissions(dynamic navigatorKey) async {
//   int retryCount = 0;
//   const maxRetries = 3; // Max number of retries before prompting to exit

//   while (retryCount < maxRetries) {
//     // Request permissions
//     final photos = await Permission.photos.request();
//     final videos = await Permission.videos.request();
//     final audio = await Permission.audio.request();
//     final storage = await Permission.storage.request();

//     // Check if all permissions are granted
//     if (photos.isGranted &&
//         videos.isGranted &&
//         audio.isGranted &&
//         storage.isGranted) {
//       print("All permissions granted ✅");
//       break; // Exit the loop if all permissions are granted
//     } else {
//       // Increment retry count
//       retryCount++;

//       // Show dialog to ask the user to retry or exit
//       await showDialog(
//         context: navigatorKey.currentContext!,
//         builder:
//             (_) => AlertDialog(
//               title: Text("Permission Required"),
//               content: Text(
//                 "To use Nistha, you must allow access to media files. You have $retryCount of $maxRetries retry attempts left.",
//               ),
//               actions: [
//                 TextButton(
//                   child: Text("Try Again"),
//                   onPressed: () => Navigator.pop(navigatorKey.currentContext!),
//                 ),
//                 TextButton(
//                   child: Text("Exit App"),
//                   onPressed: () => SystemNavigator.pop(),
//                 ),
//               ],
//             ),
//       );

//       // If retries are exceeded, exit the app
//       if (retryCount >= maxRetries) {
//         await showDialog(
//           context: navigatorKey.currentContext!,
//           builder:
//               (_) => AlertDialog(
//                 title: Text("Too Many Attempts"),
//                 content: Text(
//                   "You have exceeded the number of attempts. Exiting the app.",
//                 ),
//                 actions: [
//                   TextButton(
//                     child: Text("Exit App"),
//                     onPressed: () => SystemNavigator.pop(),
//                   ),
//                 ],
//               ),
//         );
//         break;
//       }
//     }
//   }
// }
