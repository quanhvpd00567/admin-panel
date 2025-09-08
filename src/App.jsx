import { Outlet } from 'react-router-dom';
import './App.css';
import EnvInfo from './components/debug/EnvInfo.jsx';
import { Layout } from './components/layout/index.js';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { EnhancedToastProvider } from './components/ui/Toast.jsx';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <EnhancedToastProvider>
          <Layout>
            {/* Page content will be rendered here */}
            <Outlet />
            {/* Debug component - only shows in development */}
            <EnvInfo />
          </Layout>
        </EnhancedToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
