import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import AppNavigation from "./src/navigation";  // Ensure the path to navigation is correct
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <View style={{ flex: 1 }}>
        <AppNavigation />
        <StatusBar style="auto" />
      </View>
    </I18nextProvider>
  );
}
