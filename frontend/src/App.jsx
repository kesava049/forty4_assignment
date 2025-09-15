import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetails from './components/UserDetails';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <nav className="navbar">
            <Link to="/" className="nav-brand">User Dashboard</Link>
            <Link to="/add" className="nav-link-button">Add New User</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route path="/add" element={<UserForm />} />
            <Route path="/edit/:id" element={<UserForm />} />
            <Route path="/user/:id" element={<UserDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;