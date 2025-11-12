import React from 'react';
import { PlusIcon, LogoutIcon } from './icons';
import type { User } from '../types';

interface HeaderProps {
    onStartAuction: () => void;
    user: User | null;
    onLogout: () => void;
    currentView: string;
    setCurrentView: (view: 'all' | 'my-auctions' | 'my-bids') => void;
    myAuctionsNotificationCount: number;
    myBidsNotificationCount: number;
}

const NavLink: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    notificationCount: number;
}> = ({ isActive, onClick, children, notificationCount }) => (
    <button
        onClick={onClick}
        className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-brand-green-dark text-white'
                : 'text-brand-gray hover:bg-brand-bg-light hover:text-white'
        }`}
    >
        {children}
        {notificationCount > 0 && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-brand-bg-light"></span>
        )}
    </button>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout, onStartAuction, currentView, setCurrentView, myAuctionsNotificationCount, myBidsNotificationCount }) => {
    return (
        <header className="bg-brand-bg-light shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <div className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-300" style={{ filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.5))' }}>
                            e-lance
                        </div>
                    </div>
                    {user && (
                        <nav className="hidden md:flex items-center space-x-4">
                            <NavLink isActive={currentView === 'all'} onClick={() => setCurrentView('all')} notificationCount={0}>
                                Leilões
                            </NavLink>
                            <NavLink isActive={currentView === 'my-auctions'} onClick={() => setCurrentView('my-auctions')} notificationCount={myAuctionsNotificationCount}>
                                Meus Leilões
                            </NavLink>
                            <NavLink isActive={currentView === 'my-bids'} onClick={() => setCurrentView('my-bids')} notificationCount={myBidsNotificationCount}>
                                Meus Lances
                            </NavLink>
                        </nav>
                    )}
                    <div className="flex items-center space-x-4">
                         {user && (
                             <>
                                <span className="text-brand-gray text-sm hidden sm:block">Olá, {user.username}</span>
                                <button
                                    onClick={onStartAuction}
                                    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-bg-dark bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-light focus:ring-brand-gold transition-colors duration-300"
                                >
                                    <PlusIcon className="h-5 w-5 mr-2" />
                                    Iniciar Leilão
                                </button>
                                <button onClick={onLogout} className="p-2 rounded-full text-brand-gray hover:text-white hover:bg-brand-bg-light focus:outline-none focus:ring-2 focus:ring-white">
                                    <LogoutIcon className="h-6 w-6"/>
                                </button>
                             </>
                         )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;