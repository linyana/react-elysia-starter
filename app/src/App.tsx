
import { ErrorBoundary } from '@/components';
import { MessageApiProvider } from '@/hooks';
import { Routes, ThemeProvider } from '@/providers';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MessageApiProvider>
          <Routes />
        </MessageApiProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
