import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../Screens/LoginScreen";
import RegistrationScreen from "../Screens/RegistrationScreen";
import CommentsScreen from "../Screens/CommentsScreen";
import ButtonGoBack from "../components/ButtonGoBack";
import MapScreen from "../Screens/MapScreen";
import BottomNavigator from "./BottomNavigator";

const MainScreenStack = createStackNavigator();

export default function AppNavigator() {
  const navigation = useNavigation();

  return (
    <MainScreenStack.Navigator initialRouteName="Login">
      <MainScreenStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <MainScreenStack.Screen
        name="Registration"
        component={RegistrationScreen}
        options={{ headerShown: false }}
      />
      <MainScreenStack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{ headerShown: false }}
      />
      <MainScreenStack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          title: "Коментарі",
          headerStyle: {
            backgroundColor: "#FFF",
            borderBottomWidth: 1,
            boxShadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0.30)",
          },
          headerTitleStyle: {
            color: "#212121",
            fontFamily: "Roboto-Bold",
            fontSize: 17,
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: 22,
            letterSpacing: -0.408,
          },
          headerTitleAlign: "center",
          headerLeft: () => <ButtonGoBack />,
        }}
      />
      <MainScreenStack.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Карта",
          headerStyle: {
            backgroundColor: "#FFF",
            borderBottomWidth: 1,
            boxShadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0.30)",
          },
          headerTitleStyle: {
            color: "#212121",
            fontFamily: "Roboto-Bold",
            fontSize: 17,
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: 22,
            letterSpacing: -0.408,
          },
          headerTitleAlign: "center",
          headerLeft: () => <ButtonGoBack />,
        }}
      />
    </MainScreenStack.Navigator>
  );
}