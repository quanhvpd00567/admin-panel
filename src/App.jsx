import { Outlet } from 'react-router-dom';
import './App.css';
import EnvInfo from './components/debug/EnvInfo.jsx';
import { Layout } from './components/layout/index.js';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Layout>
          {/* Page content will be rendered here */}
          <Outlet />

          {/* Debug component - only shows in development */}
          <EnvInfo />
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
