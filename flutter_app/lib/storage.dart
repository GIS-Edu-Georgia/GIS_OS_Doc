import 'package:shared_preferences/shared_preferences.dart';
import 'package:shared_preferences_android/shared_preferences_android.dart';

/// Uses the same native SharedPreferences files ("bookmarks", "settings") as
/// the old Kotlin app, so bookmarks and font size survive the update.
SharedPreferencesAsync _open(String fileName) => SharedPreferencesAsync(
  options: SharedPreferencesAsyncAndroidOptions(
    backend: SharedPreferencesAndroidBackendLibrary.SharedPreferences,
    originalSharedPreferencesOptions: AndroidSharedPreferencesStoreOptions(
      fileName: fileName,
    ),
  ),
);

class Bookmark {
  const Bookmark(this.title, this.url);
  final String title;
  final String url;
}

class BookmarkStore {
  final SharedPreferencesAsync _prefs = _open('bookmarks');

  Future<List<Bookmark>> all() async {
    final map = await _prefs.getAll();
    final list = <Bookmark>[];
    map.forEach((title, url) {
      if (url is String) list.add(Bookmark(title, url));
    });
    list.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
    return list;
  }

  Future<void> add(String title, String url) => _prefs.setString(title, url);

  Future<void> remove(String title) => _prefs.remove(title);
}

class SettingsStore {
  final SharedPreferencesAsync _prefs = _open('settings');

  static const fontSizes = [85, 100, 115, 130];

  Future<int> fontZoom() async => await _prefs.getInt('font_zoom') ?? 100;

  Future<void> setFontZoom(int zoom) => _prefs.setInt('font_zoom', zoom);

  Future<String?> lastUrl() => _prefs.getString('last_url');

  Future<void> setLastUrl(String url) => _prefs.setString('last_url', url);
}
