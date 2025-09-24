import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>BuffetFlow</h2>
          <div className="user-info">
            <p>{user?.first_name} {user?.last_name}</p>
            <span className="role">{user?.role}</span>
          </div>
        </div>
        
        <ul className="nav-menu">
          <li>
            <Link 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/events" 
              className={isActive('/events') ? 'active' : ''}
            >
              🎉 Eventos
            </Link>
          </li>
          <li>
            <Link 
              to="/menu" 
              className={isActive('/menu') ? 'active' : ''}
            >
              🍽️ Cardápio
            </Link>
          </li>
          <li>
            <Link 
              to="/financial" 
              className={isActive('/financial') ? 'active' : ''}
            >
              💰 Financeiro
            </Link>
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            🚪 Sair
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;