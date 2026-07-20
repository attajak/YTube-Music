import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppContext } from '@/context/AppContext';
import { useColors } from '@/hooks/useColors';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
        {title}
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

interface RowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  noBorder?: boolean;
}

function SettingsRow({ icon, iconColor, label, right, onPress, noBorder }: RowProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.row,
        !noBorder && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
    >
      <View style={[styles.rowIcon, { backgroundColor: iconColor ?? colors.primary }]}>
        <Ionicons name={icon} size={17} color="#fff" />
      </View>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.rowRight}>{right}</View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { adBlocking, toggleAdBlocking } = useAppContext();

  const handleToggleAd = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleAdBlocking();
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Browsing Data',
      'This will clear cookies and browsing history. You will be signed out of Google.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            // WebView cookies are cleared on next reload via key change
          },
        },
      ]
    );
  };

  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 67 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: topPad + 16,
          paddingBottom: insets.bottom + (isWeb ? 34 : 0) + 24,
        },
      ]}
    >
      {/* Ad Blocking */}
      <SettingsSection title="PLAYBACK">
        <SettingsRow
          icon="shield-checkmark"
          iconColor="#34C759"
          label="Block Ads"
          noBorder
          right={
            <Switch
              value={adBlocking}
              onValueChange={handleToggleAd}
              trackColor={{ false: colors.border, true: '#34C759' }}
              thumbColor={Platform.OS === 'android' ? (adBlocking ? '#fff' : '#ccc') : undefined}
            />
          }
        />
      </SettingsSection>

      {/* Account */}
      <SettingsSection title="ACCOUNT">
        <SettingsRow
          icon="logo-google"
          iconColor="#4285F4"
          label="Sign in with Google"
          right={
            <View style={styles.signInHint}>
              <Text style={[styles.hintText, { color: colors.mutedForeground }]}>
                via YouTube tab
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.mutedForeground} />
            </View>
          }
          noBorder
        />
      </SettingsSection>

      <View style={[styles.accountNote, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="information-circle" size={16} color={colors.mutedForeground} style={{ marginTop: 1 }} />
        <Text style={[styles.noteText, { color: colors.mutedForeground }]}>
          Sign in to your Google account directly on the YouTube or YouTube Music tab. Your session is saved automatically.
        </Text>
      </View>

      {/* Data */}
      <SettingsSection title="DATA">
        <SettingsRow
          icon="trash-bin"
          iconColor="#FF3B30"
          label="Clear Browsing Data"
          onPress={handleClearData}
          noBorder
          right={<Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />}
        />
      </SettingsSection>

      {/* About */}
      <SettingsSection title="ABOUT">
        <SettingsRow
          icon="logo-youtube"
          iconColor="#FF0000"
          label="YTube"
          noBorder
          right={
            <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
              v1.0.0
            </Text>
          }
        />
      </SettingsSection>

      <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
        YTube is not affiliated with YouTube or Google.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingLeft: 4,
  },
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  rowRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  hintText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  accountNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 10,
    padding: 12,
    marginTop: -8,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
});
