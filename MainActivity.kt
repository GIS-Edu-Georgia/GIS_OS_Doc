package com.gisosdoc

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    // პირველი ცდა — custom domain
    private val PRIMARY_URL = "https://osdoc.qgis.ge/"
    // fallback — GitHub Pages (ყოველთვის მუშაობს)
    private val FALLBACK_URL = "https://osdoc.qgis.ge/"
    private var usedFallback = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.myWebView)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)

        val webSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.databaseEnabled = true
        webSettings.useWideViewPort = true
        webSettings.loadWithOverviewMode = true
        webSettings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.webViewClient = object : WebViewClient() {

            override fun onPageFinished(view: WebView?, url: String?) {
                swipeRefreshLayout.isRefreshing = false
            }

            // API 23-მდე (deprecated, მაგრამ საჭიროა ძველი მოწყობილობებისთვის)
            @Suppress("OVERRIDE_DEPRECATION")
            override fun onReceivedError(
                view: WebView?,
                errorCode: Int,
                description: String?,
                failingUrl: String?
            ) {
                if (!usedFallback) {
                    usedFallback = true
                    view?.loadUrl(FALLBACK_URL)
                }
            }

            // API 23+ (Android 6.0+)
            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    if (!usedFallback && request?.isForMainFrame == true) {
                        usedFallback = true
                        view?.loadUrl(FALLBACK_URL)
                    }
                }
            }
        }

        // პირველად domain-ს ვცდით
        webView.loadUrl(PRIMARY_URL)

        // Swipe to Refresh — ისევ primary-დან იწყება
        swipeRefreshLayout.setOnRefreshListener {
            usedFallback = false
            webView.reload()
        }

        // Back ღილაკი
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }
}
