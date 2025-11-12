import React, { useState } from 'react';
import type { User } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
    mockUsers: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, mockUsers }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = mockUsers.find(
            (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );

        if (user) {
            onLogin(user);
        } else {
            setError('Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg-dark flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-300" style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))' }}>
                        e-lance
                    </div>
                    <p className="text-brand-gray mt-4">Seu portal de leilões online</p>
                </div>

                <div className="bg-brand-bg-light shadow-2xl rounded-lg p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-brand-gray text-sm font-bold mb-2" htmlFor="username">
                                Usuário
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-brand-bg-dark text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                id="username"
                                type="text"
                                placeholder="Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-brand-gray text-sm font-bold mb-2" htmlFor="password">
                                Senha
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-brand-bg-dark text-gray-300 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                id="password"
                                type="password"
                                placeholder="******************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

                        <div className="flex items-center justify-between">
                            <button
                                className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-bg-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                                type="submit"
                            >
                                Entrar
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-xs text-brand-gray">Use: ana/123, bruno/123, ou carla/123</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;