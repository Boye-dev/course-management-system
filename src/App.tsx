import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import { Router } from './Router';
import { theme } from './theme';
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications position="top-right" zIndex={1000} limit={5} />
        <Router />
      </MantineProvider>
    </QueryClientProvider>
  );
}
