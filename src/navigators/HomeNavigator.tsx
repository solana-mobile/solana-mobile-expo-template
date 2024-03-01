import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { TopBar } from "../components/top-bar/top-bar-feature";
import { HomeScreen } from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

/**
 * This is the main navigator with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function HomeNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <TopBar />,
      }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
    </Tab.Navigator>
  );
}
