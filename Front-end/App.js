import './i18n';
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/vi';
import 'intl/locale-data/jsonp/ja';
import 'intl/locale-data/jsonp/zh';
import 'intl-pluralrules'; // Polyfill cho PluralRules
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./src/navigation";

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigation />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}




// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";
// import AppNavigation from "./src/navigation";

// export default function App() {
//   return (
//     <AppNavigation />
//   );
// }


