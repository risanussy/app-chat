import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import '../assets/css/App.css';

// component
import { Sidebar, Chat } from '../components'

function App() {
  const [status, setStatus] = useState('anon');
  const [users, setUsers] = useState(null);

  return (
    <>
    <Router>
      <div className="app">
        <Sidebar status={status} setStatus={setStatus} setUsers={setUsers} />
        <Chat users={users} status={status} />
      </div>
    </Router>
    </>
  );
}

export default App;
