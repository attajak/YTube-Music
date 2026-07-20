import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import { useAppContext } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

const MOBILE_UA_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const MOBILE_UA_ANDROID =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

const MOBILE_UA =
  Platform.OS === 'ios' ? MOBILE_UA_IOS : MOBILE_UA_ANDROID;

const AD_BLOCKER_SCRIPT = `
(function() {
  'use strict';
  function blockAds() {
    var skipSelectors = [
      '.ytp-skip-ad-button',
      '.ytp-ad-skip-button',
      '.ytp-ad-skip-button-modern',
      'button.videoAdUiSkipButton',
      '.videoAdUiSkipContainer button',
    ];
    skipSelectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(btn) {
        try { btn.click(); } catch(e) {}
      });
    });

    var hideSelectors = [
      '.ytp-ad-overlay-container',
      '.ytp-ad-text-overlay',
      '.ytp-ad-image-overlay',
      '.ytp-ad-progress',
      '.ytp-ad-progress-list',
      'ytd-action-companion-ad-renderer',
      'ytd-display-ad-renderer',
      'ytd-promoted-sparkles-web-renderer',
      'ytd-promoted-video-renderer',
      'ytd-banner-promo-renderer',
      'ytd-ad-slot-renderer',
      '#masthead-ad',
      '.ytd-rich-section-renderer',
      '.video-ads.ytp-ad-module',
    ];
    hideSelectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.style.setProperty('display', 'none', 'important');
      });
    });
  }

  blockAds();
  setInterval(blockAds, 300);

  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(blockAds).observe(
      document.documentElement,
      { childList: true, subtree: true }
    );
  }
  true;
})();
`;

interface Props {
  url: string;
}

export default function YouTubeWebView({ url }: Props) {
  const { adBlocking } = useAppContext();
  const colors = useColors();
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <WebView
        key={adBlocking ? 'ad-block-on' : 'ad-block-off'}
        source={{ uri: url }}
        style={styles.webview}
        userAgent={MOBILE_UA}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={true}
        injectedJavaScript={adBlocking ? AD_BLOCKER_SCRIPT : undefined}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState={false}
      />
      {loading && (
        <View
          style={[
            styles.loader,
            { backgroundColor: colors.background },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
