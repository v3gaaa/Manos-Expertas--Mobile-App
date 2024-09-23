import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { Theme } from '../constants/theme';
import Login from "../app/login";
import Register from "../app/register";
import Welcome from "../app/welcome";
import Home from "../app/home";
import AdminHome from "../app/adminHome";
import AdminSearchScreen from "../app/adminSearchScreen";
import searchScreen from "../app/searchScreen";
import WorkerDetail from "../app/WorkerDetail";
import CalendarAvailability from "../app/CalendarAvailability";
import TimeAvailability from "../app/TimeAvailability";
import BookingSuccess from "../app/BookingSuccess";
import AddWorker from "../app/addWorker";
import EditWorker from "../app/editWorker";
import allBookedAppointments from "../app/allBookedAppointments";
import RegisterAdmin from "../app/registerAdmin";
import { RootStackParamList } from "../types";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Theme.colors.bgColor,
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false}} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }} // Disable default header for Home
      />
      <Stack.Screen name="SearchScreen" component={searchScreen} options={{ headerShown: false}} />
      <Stack.Screen name="WorkerDetail" component={WorkerDetail} options={{ headerShown: false }} />
      <Stack.Screen name="CalendarAvailability" component={CalendarAvailability} options={{ headerShown: false }} />
      <Stack.Screen name="TimeAvailability" component={TimeAvailability} options={{ headerShown: false }} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccess} options={{ headerShown: false }} />
      <Stack.Screen name="allBookedAppointments" component={allBookedAppointments} options={{ headerShown: false }} />
      <Stack.Screen name="AdminHome" component={AdminHome} options={{ headerShown: false}} />
      <Stack.Screen name="AdminSearchScreen" component={AdminSearchScreen} options={{ headerShown: false}} />
      <Stack.Screen name="AddWorker" component={AddWorker} />
      <Stack.Screen name="EditWorker" component={EditWorker} />
      <Stack.Screen name="RegisterAdmin" component={RegisterAdmin} />
    </Stack.Navigator>
  );
};
