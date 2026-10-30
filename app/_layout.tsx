import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CourseProvider } from '../src/context/CourseContext';
import { colors } from '../src/theme/tokens';

export default function RootLayout() {
  return (
    <CourseProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'BJJ_Lang',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="select-direction"
          options={{
            title: 'Select Course Direction',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            title: 'Lesson',
          }}
        />
        <Stack.Screen
          name="review"
          options={{
            title: 'Vocabulary Review',
          }}
        />
      </Stack>
    </CourseProvider>
  );
}
