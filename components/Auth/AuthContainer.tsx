
import React, { useState } from 'react';
import { authService } from '../../services/authService.ts';
import { User, AuthMode } from '../../types.ts';

interface AuthContainerProps {
  onAuthenticated: (user: User) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthenticated, isDarkMode, toggleDarkMode }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const user = await authService.login(email, password);
        if (!user.username) {
          setTempUser(user);
          setMode('username-setup');
        } else {
          onAuthenticated(user);
        }
      } else if (mode === 'signup') {
        const user = await authService.signup(email, password);
        setTempUser(user);
        setMode('username-setup');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSetup = async () => {
    if (!tempUser || username.length < 3) return;
    setLoading(true);
    try {
      const isAvailable = await authService.checkUsername(username);
      if (!isAvailable) {
        setError('Username is taken. Try: ' + username + Math.floor(Math.random() * 99));
        return;
      }
      const user = await authService.updateUsername(tempUser.uid, username);
      onAuthenticated(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6 transition-colors duration-500">
      <div className="absolute top-8 right-8">
         <button onClick={toggleDarkMode} className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400">
           <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
         </button>
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-[2rem] text-white shadow-xl shadow-green-200 dark:shadow-none mb-4">
             <i className="fas fa-leaf text-3xl"></i>
           </div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
             {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join Calippo' : 'Final Step'}
           </h1>
           <p className="text-gray-500 dark:text-gray-400">
             {mode === 'username-setup' ? 'Claim your unique handle' : 'Sign in to sync your fitness journey'}
           </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center space-x-3">
             <i className="fas fa-circle-exclamation"></i>
             <span>{error}</span>
          </div>
        )}

        <form onSubmit={mode === 'username-setup' ? (e) => { e.preventDefault(); handleUsernameSetup(); } : handleAuth} className="space-y-4">
          {mode !== 'username-setup' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-green-500 p-5 rounded-[2rem] outline-none transition-all dark:text-white"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-green-500 p-5 rounded-[2rem] outline-none transition-all dark:text-white"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
              </div>
            </>
          )}

          {mode === 'username-setup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Pick a Username</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-green-600 font-bold">@</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-green-500 p-5 pl-10 rounded-[2rem] outline-none transition-all dark:text-white"
                  placeholder="username"
                  maxLength={20}
                  minLength={3}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-green-600 text-white font-black rounded-[2rem] shadow-xl shadow-green-100 dark:shadow-none hover:bg-green-700 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner animate-spin"></i> : (mode === 'username-setup' ? 'Claim Username' : 'Continue')}
          </button>
        </form>

        <div className="relative py-4">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-800"></div></div>
           <div className="relative flex justify-center text-[10px] uppercase font-black text-gray-400 tracking-widest">
             <span className="bg-white dark:bg-gray-950 px-4">Social Login</span>
           </div>
        </div>

        <button 
          onClick={() => alert("Google sign-in simulated. In real app, this redirects to OAuth.")}
          className="w-full py-4 border-2 border-gray-100 dark:border-gray-800 rounded-[2rem] flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          <span>Continue with Google</span>
        </button>

        <div className="text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm font-bold text-gray-400 hover:text-green-600 transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Create one" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};
