import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campuspulse_token'));
  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev && prev.message === message ? null : prev));
    }, 4500);
  };

  // Fetch all users and restore session
  useEffect(() => {
    async function initAuth() {
      try {
        const usersRes = await api.getUsers();
        if (usersRes.success) {
          setDemoUsers(usersRes.users);

          // If no stored user or token, default to Alex Rivera (Student) for instant hackathon walkthrough!
          if (!token) {
            const defaultUser = usersRes.users.find(u => u.id === 'usr_student_1') || usersRes.users[0];
            if (defaultUser) {
              const res = await api.quickSwitch(defaultUser.id);
              if (res.success) {
                setUser(res.user);
                setToken(res.token);
                localStorage.setItem('campuspulse_token', res.token);
              }
            }
          } else {
            // Restore from me endpoint
            try {
              const meRes = await api.getMe();
              if (meRes.success) {
                setUser(meRes.user);
              }
            } catch (e) {
              // fallback to quickswitch student
              const defaultUser = usersRes.users[0];
              if (defaultUser) {
                const res = await api.quickSwitch(defaultUser.id);
                setUser(res.user);
                setToken(res.token);
                localStorage.setItem('campuspulse_token', res.token);
              }
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const switchRoleUser = async (userId) => {
    try {
      setLoading(true);
      const res = await api.quickSwitch(userId);
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('campuspulse_token', res.token);
        showToast(`Switched profile to ${res.user.name} (${res.user.role.toUpperCase()})`, 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to switch profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('campuspulse_token', res.token);
        showToast(`Welcome back, ${res.user.name}!`);
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('campuspulse_token', res.token);
        showToast(`Account created! Welcome to CampusPulse, ${res.user.name}.`);
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campuspulse_token');
    showToast('Signed out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      role: user?.role || 'student',
      demoUsers,
      loading,
      toast,
      showToast,
      switchRoleUser,
      login,
      register,
      logout
    }}>
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 animate-bounce-once border text-sm font-medium
          ${toast.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-200' :
            toast.type === 'info' ? 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200' :
            'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'}">
          <span className="w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-400' : toast.type === 'info' ? 'bg-indigo-400' : 'bg-emerald-400'} animate-ping" />
          <span>{toast.message}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
