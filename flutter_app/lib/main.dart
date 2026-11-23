import 'package:flutter/material.dart';

import 'home_page.dart';

const gisGreen = Color(0xFF4CAF50);
const gisDarkBg = Color(0xFF1E1E2E);

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const GisOsDocApp());
}

class GisOsDocApp extends StatelessWidget {
  const GisOsDocApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GIS OS DOC',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: gisGreen),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: gisGreen,
          brightness: Brightness.dark,
          surface: gisDarkBg,
        ),
      ),
      home: const HomePage(),
    );
  }
}
