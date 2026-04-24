import { ErrorBoundary } from './components';
import { MessageApiProvider } from './hooks';
import { AuthGate, Routes, ThemeProvider } from './providers';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MessageApiProvider>
          <AuthGate>
            <Routes />
          </AuthGate>
        </MessageApiProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
