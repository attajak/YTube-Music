import YouTubeWebView from '@/components/YouTubeWebView';
import { StyleSheet, View } from 'react-native';

export default function YouTubeMusicScreen() {
  return (
    <View style={styles.container}>
      <YouTubeWebView url="https://music.youtube.com" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
