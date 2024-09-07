import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import AppNavigation from "./src/navigation";
import 'intl-pluralrules';
import { I18nextProvider } from 'react-i18next';  
import i18n from './i18n';  

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <View style={{ flex: 1 }}>
        {/* Ensure AppNavigation does not contain unwrapped text */}
        <AppNavigation />
        <StatusBar style="auto" />
      </View>
    </I18nextProvider>
  );
}
