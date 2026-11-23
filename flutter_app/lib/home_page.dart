import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';

import 'storage.dart';

const primaryUrl = 'https://osdoc.qgis.ge/';
const offlineAsset = 'assets/offline.html';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late final WebViewController _controller;
  final _bookmarks = BookmarkStore();
  final _settings = SettingsStore();
  int _progress = 0;
  bool _loading = true;
  final ValueNotifier<({int done, int total, bool finished})> _dl =
      ValueNotifier((done: 0, total: 0, finished: false));

  // Visits every page listed in the sitemap, plus the images/styles/scripts
  // each page uses. The site's service worker stores every response, which
  // makes the whole documentation readable offline.
  static const _prefetchScript = r'''
(async () => {
  window.__cancelDl = false;
  const sm = await (await fetch('/sitemap.xml')).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)/g)]
    .map(m => m[1]).filter(u => new URL(u).origin === location.origin);
  let done = 0;
  DownloadProgress.postMessage(done + '/' + urls.length);
  for (const u of urls) {
    if (window.__cancelDl) return;
    try {
      const html = await (await fetch(u)).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const res = new Set();
      doc.querySelectorAll('img[src],script[src],link[href]').forEach(e => {
        const v = e.getAttribute('src') || e.getAttribute('href');
        try {
          const a = new URL(v, u);
          if (a.origin === location.origin) res.add(a.href);
        } catch (_) {}
      });
      await Promise.all([...res].map(x => fetch(x).catch(() => {})));
    } catch (_) {}
    done++;
    DownloadProgress.postMessage(done + '/' + urls.length);
  }
})();
''';

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'DownloadProgress',
        onMessageReceived: (m) {
          final parts = m.message.split('/');
          if (parts.length != 2) return;
          final done = int.tryParse(parts[0]) ?? 0;
          final total = int.tryParse(parts[1]) ?? 0;
          _dl.value = (
            done: done,
            total: total,
            finished: total > 0 && done >= total,
          );
        },
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (p) => setState(() => _progress = p),
          onPageStarted: (_) => setState(() => _loading = true),
          onPageFinished: (url) {
            setState(() => _loading = false);
            _rememberPage(url);
          },
          onNavigationRequest: _onNavigation,
          onWebResourceError: (error) async {
            if ((error.isForMainFrame ?? false) && !await _isOnline()) {
              _loadOffline();
            }
          },
          onSslAuthError: _onSslError,
        ),
      );
    _start();
  }

  Future<void> _start() async {
    final zoom = await _settings.fontZoom();
    final platform = _controller.platform;
    if (platform is AndroidWebViewController) {
      await platform.setTextZoom(zoom);
    }
    // Always try the site first: its service worker serves cached pages when
    // offline. The offline page is only a fallback when loading fails.
    await _controller.loadRequest(Uri.parse(await _startUrl()));
  }

  /// Opens the page the user was reading last, if it belongs to our site.
  Future<String> _startUrl() async {
    final last = await _settings.lastUrl();
    final uri = last == null ? null : Uri.tryParse(last);
    if (uri != null && uri.scheme == 'https' && uri.host == 'osdoc.qgis.ge') {
      return last!;
    }
    return primaryUrl;
  }

  Future<void> _rememberPage(String url) async {
    final uri = Uri.tryParse(url);
    if (uri != null && uri.scheme == 'https' && uri.host == 'osdoc.qgis.ge') {
      await _settings.setLastUrl(url);
    }
  }

  Future<void> _loadOffline() => _controller.loadFlutterAsset(offlineAsset);

  Future<bool> _isOnline() async {
    final result = await Connectivity().checkConnectivity();
    return !result.contains(ConnectivityResult.none);
  }

  Future<NavigationDecision> _onNavigation(NavigationRequest request) async {
    final uri = Uri.tryParse(request.url);
    if (uri == null) return NavigationDecision.navigate;

    // The offline page signals "retry" with a custom scheme.
    if (uri.scheme == 'app' && uri.host == 'retry') {
      if (await _isOnline()) {
        _controller.loadRequest(Uri.parse(await _startUrl()));
      } else {
        _toast('კავშირი არ არის');
      }
      return NavigationDecision.prevent;
    }

    // Non-web schemes (mailto:, tel:, intent:) go to the system.
    if (!{
      'http',
      'https',
      'file',
      'about',
      'data',
      'blob',
    }.contains(uri.scheme)) {
      launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      ).catchError((_) => false);
      return NavigationDecision.prevent;
    }
    return NavigationDecision.navigate;
  }

  Future<void> _onSslError(SslAuthError error) async {
    if (!mounted) {
      await error.cancel();
      return;
    }
    final proceed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Text('უსაფრთხოების შეცდომა'),
        content: const Text(
          'ვებ-გვერდის სერტიფიკატი არასანდოა. გსურთ მაინც გაგრძელება?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('გაუქმება'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('გაგრძელება'),
          ),
        ],
      ),
    );
    if (proceed == true) {
      await error.proceed();
    } else {
      await error.cancel();
    }
  }

  void _toast(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _share() async {
    final url = await _controller.currentUrl();
    if (url == null || url.startsWith('file:')) return;
    final title = await _controller.getTitle();
    await SharePlus.instance.share(
      ShareParams(
        text: url,
        subject: (title == null || title.isEmpty) ? 'GIS OS DOC' : title,
      ),
    );
  }

  Future<void> _addBookmark() async {
    final url = await _controller.currentUrl();
    if (url == null || url.startsWith('file:')) return;
    final title = await _controller.getTitle();
    await _bookmarks.add(
      (title == null || title.trim().isEmpty) ? url : title,
      url,
    );
    _toast('სანიშნე შენახულია');
  }

  Future<void> _showBookmarks() async {
    final list = await _bookmarks.all();
    if (!mounted) return;
    if (list.isEmpty) {
      _toast('სანიშნეები არ გაქვთ');
      return;
    }
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => _BookmarksSheet(
        bookmarks: list,
        onOpen: (b) async {
          Navigator.pop(ctx);
          _controller.loadRequest(Uri.parse(b.url));
        },
        onDelete: (b) => _bookmarks.remove(b.title),
      ),
    );
  }

  Future<void> _showFontSize() async {
    const labels = [
      'პატარა (85%)',
      'ნორმალური (100%)',
      'დიდი (115%)',
      'ძალიან დიდი (130%)',
    ];
    final current = await _settings.fontZoom();
    if (!mounted) return;
    final chosen = await showDialog<int>(
      context: context,
      builder: (ctx) => SimpleDialog(
        title: const Text('შრიფტის ზომა'),
        children: [
          for (var i = 0; i < labels.length; i++)
            ListTile(
              title: Text(labels[i]),
              leading: Icon(
                SettingsStore.fontSizes[i] == current
                    ? Icons.radio_button_checked
                    : Icons.radio_button_off,
              ),
              onTap: () => Navigator.pop(ctx, SettingsStore.fontSizes[i]),
            ),
        ],
      ),
    );
    if (chosen == null) return;
    final platform = _controller.platform;
    if (platform is AndroidWebViewController) {
      await platform.setTextZoom(chosen);
    }
    await _settings.setFontZoom(chosen);
  }

  Future<void> _downloadOffline() async {
    final current = await _controller.currentUrl();
    if (!await _isOnline()) {
      _toast('კავშირი არ არის');
      return;
    }
    if (current == null || !current.startsWith(primaryUrl)) {
      _toast('ჯერ გახსენით საიტის რომელიმე გვერდი');
      return;
    }
    if (!mounted) return;
    final net = await Connectivity().checkConnectivity();
    final onWifi =
        net.contains(ConnectivityResult.wifi) ||
        net.contains(ConnectivityResult.ethernet);
    if (!mounted) return;
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('ოფლაინისთვის გადმოწერა'),
        content: Text(
          onWifi
              ? 'მთელი დოკუმენტაცია (დაახლოებით 150 MB) შეინახება ტელეფონზე, რომ ინტერნეტის გარეშეც წაიკითხოთ. გაგრძელება?'
              : 'ახლა მობილური ინტერნეტი გიჩართიათ. გადმოწერას დაახლოებით 150 MB დასჭირდება. ჯობია Wi-Fi-ზე გააკეთოთ. მაინც გაგრძელება?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('გაუქმება'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('გადმოწერა'),
          ),
        ],
      ),
    );
    if (ok != true || !mounted) return;
    _dl.value = (done: 0, total: 0, finished: false);
    await _controller.runJavaScript(_prefetchScript);
    if (!mounted) return;
    await showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => ValueListenableBuilder(
        valueListenable: _dl,
        builder: (_, v, _) => AlertDialog(
          title: const Text('ოფლაინისთვის გადმოწერა'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              LinearProgressIndicator(
                value: v.total == 0 ? null : v.done / v.total,
              ),
              const SizedBox(height: 12),
              Text(
                v.finished
                    ? 'მზადაა! ყველა გვერდი ხელმისაწვდომია ოფლაინ.'
                    : v.total == 0
                    ? 'მზადდება...'
                    : '${v.done} / ${v.total} გვერდი',
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                if (!v.finished) {
                  _controller.runJavaScript('window.__cancelDl = true;');
                }
                Navigator.pop(ctx);
              },
              child: Text(v.finished ? 'დახურვა' : 'შეწყვეტა'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _reload() async {
    final current = await _controller.currentUrl();
    if (current == null || current.startsWith('file:')) {
      // We are on the offline fallback page: retry the real site.
      await _controller.loadRequest(Uri.parse(await _startUrl()));
    } else {
      await _controller.reload();
    }
  }

  Future<void> _onBack() async {
    if (await _controller.canGoBack()) {
      await _controller.goBack();
    } else {
      await SystemNavigator.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _onBack();
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('GIS OS DOC'),
          actions: [
            IconButton(
              tooltip: 'განახლება',
              icon: const Icon(Icons.refresh),
              onPressed: _reload,
            ),
            PopupMenuButton<String>(
              onSelected: (value) {
                switch (value) {
                  case 'share':
                    _share();
                  case 'add':
                    _addBookmark();
                  case 'list':
                    _showBookmarks();
                  case 'font':
                    _showFontSize();
                  case 'offline':
                    _downloadOffline();
                }
              },
              itemBuilder: (_) => const [
                PopupMenuItem(value: 'share', child: Text('გაზიარება')),
                PopupMenuItem(value: 'add', child: Text('სანიშნეს დამატება')),
                PopupMenuItem(value: 'list', child: Text('სანიშნეები')),
                PopupMenuItem(value: 'font', child: Text('შრიფტის ზომა')),
                PopupMenuItem(
                  value: 'offline',
                  child: Text('ოფლაინისთვის გადმოწერა'),
                ),
              ],
            ),
          ],
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(3),
            child: _loading && _progress < 100
                ? LinearProgressIndicator(
                    value: _progress == 0 ? null : _progress / 100,
                  )
                : const SizedBox(height: 3),
          ),
        ),
        body: SafeArea(child: WebViewWidget(controller: _controller)),
      ),
    );
  }
}

class _BookmarksSheet extends StatefulWidget {
  const _BookmarksSheet({
    required this.bookmarks,
    required this.onOpen,
    required this.onDelete,
  });

  final List<Bookmark> bookmarks;
  final void Function(Bookmark) onOpen;
  final Future<void> Function(Bookmark) onDelete;

  @override
  State<_BookmarksSheet> createState() => _BookmarksSheetState();
}

class _BookmarksSheetState extends State<_BookmarksSheet> {
  late final List<Bookmark> _items = [...widget.bookmarks];
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final q = _query.trim().toLowerCase();
    final shown = q.isEmpty
        ? _items
        : _items
              .where(
                (b) =>
                    b.title.toLowerCase().contains(q) ||
                    b.url.toLowerCase().contains(q),
              )
              .toList();
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.7,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'სანიშნეები',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
              ),
              if (_items.length > 5)
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                  child: TextField(
                    decoration: const InputDecoration(
                      prefixIcon: Icon(Icons.search),
                      hintText: 'ძიება სანიშნეებში',
                      border: OutlineInputBorder(),
                      isDense: true,
                    ),
                    onChanged: (v) => setState(() => _query = v),
                  ),
                ),
              Flexible(
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: shown.length,
                  itemBuilder: (ctx, i) {
                    final b = shown[i];
                    return ListTile(
                      title: Text(
                        b.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      subtitle: Text(
                        b.url,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      onTap: () => widget.onOpen(b),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete_outline),
                        onPressed: () async {
                          await widget.onDelete(b);
                          setState(() => _items.remove(b));
                          if (_items.isEmpty && ctx.mounted) Navigator.pop(ctx);
                        },
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
