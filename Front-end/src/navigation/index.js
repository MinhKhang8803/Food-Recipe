import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RecipeDetailsScreen from "../screens/RecipeDetailsScreen";
import UserScreen from '../screens/UserScreen';
import UserInfo from "../screens/UserInfo";
import Register from "../screens/Register"; 
import Login from "../screens/Login";  
import AdminHome from "../admin/AdminHomeScreen";
import ReportsScreen from "../admin/ReportsScreen";  
import SocialUser from "../screens/SocialUser";
import PremiumNotificationsScreen from "../admin/PremiumNotificationsScreen"; 
import BanUsersScreen from "../admin/BanUsersScreen";  

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SocialUser" component={SocialUser} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="UserInfo" component={UserInfo} />
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
      <Stack.Screen name="AdminScreen" component={AdminHome} />
      <Stack.Screen name="Reports" component={ReportsScreen} />  
      <Stack.Screen name="BanUsers" component={BanUsersScreen} />  
    </Stack.Navigator>
  );
}
