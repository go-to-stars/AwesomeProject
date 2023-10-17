import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
import PostsScreen from "../Screens/PostsScreen";
import CreatePostsScreen from "../Screens/CreatePostsScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import ButtonGoBack from "../components/ButtonGoBack";
import ButtonLogOut from "../components/ButtonLogOut";

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Posts") {
            return (
              <View
                style={[styles.iconContainer, focused && styles.activeIcon]}
              >
                <IconAntDesign name="appstore-o" size={size} color={color} />
              </View>
            );
          } else if (route.name === "CreatePosts") {
            return (
              <View
                style={[styles.iconContainer, focused && styles.activeIcon]}
              >
                <IconAntDesign name="plus" size={size} color={color} />
              </View>
            );
          } else if (route.name === "Profile") {
            return (
              <View
                style={[styles.iconContainer, focused && styles.activeIcon]}
              >
                <IconFeather name="user" size={size} color={color} />
              </View>
            );
          }
        },
        tabBarStyle: {
          backgroundColor: "white",
          paddingTop: 9,
          paddingBottom: 9,
          paddingHorizontal: 81,
          borderTopWidth: 1,
          boxShadow: "0px 0.5px 0px 0px rgba(0, 0, 0, 0.30)",
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#212121CC",
        tabBarShowLabel: false,
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
        unmountOnBlur: true,
      })}
    >
      <Tab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          title: "Публікації",
          headerRight: () => <ButtonLogOut />,
        }}
      />
      <Tab.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          title: "Створити публікацію",
          headerLeft: () => <ButtonGoBack />,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "center",
  },
  activeIcon: {
    backgroundColor: "#FF6C00",
  },
});
