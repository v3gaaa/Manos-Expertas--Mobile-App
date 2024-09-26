//More about using TypeScript with React Navigation: https://reactnavigation.org/docs/typescript/

import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  Home: undefined;
  SearchScreen: { query: string };
  WorkerDetail: { workerId: string };
  CalendarAvailability: { workerId: string };
  TimeAvailability: { workerId: string; selectedDate: string };
  BookingSuccess: { workerId: string; selectedDate: string; selectedTime: string };
  allBookedAppointments: undefined;
  AdminHome: undefined;
  AdminSearchScreen: { query: string };
  AddWorker: undefined;
  EditWorker: { workerId: string };
  EditWorkerSearch: undefined;
  RegisterAdmin: undefined;
  AllWorstWorkers: undefined;
  UserProfile: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;