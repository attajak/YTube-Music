import YouTubeWebView from '@/components/YouTubeWebView';
import { StyleSheet, View } from 'react-native';

export default function YouTubeScreen() {
  return (
    <View style={styles.container}>
      <YouTubeWebView url="https://www.youtube.com" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
