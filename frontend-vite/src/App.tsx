import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/ChatWidget';
import ThemeProvider from './components/ThemeProvider';
import ScoutOrchestration from './components/experiences/ScoutOrchestration';
import DevWorkspaces from './components/experiences/DevWorkspaces';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scout" element={<ScoutOrchestration />} />
            <Route path="/workspaces" element={<DevWorkspaces />} />
            {/* Additional experience routes will go here */}
          </Routes>
          <ChatWidget />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
