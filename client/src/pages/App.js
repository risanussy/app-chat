import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import '../assets/css/App.css';

// component
import { Sidebar, Chat } from '../components'

function App() {
  const [status, setStatus] = useState('anon');

  return (
    <>
    <Router>
      <div className="app">
        <Sidebar status={status} setStatus={setStatus} />
        <Chat status={status} />
      </div>
    </Router>
    </>
  );
}

export default App;
