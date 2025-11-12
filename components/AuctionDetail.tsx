import React, { useState, useEffect } from 'react';
import type { AuctionItem, User, Bid } from '../types';
import { ArrowLeftIcon, UsersIcon, PencilIcon, CheckBadgeIcon } from './icons';
import { formatRelativeTime } from '../utils/date';

interface AuctionDetailProps {
    item: AuctionItem;
    user: User;
    onBack: () => void;
    onBid: (itemId: number, amount: number) => void;
    onEditRequest: (item: AuctionItem) => void;
    onPayRequest: (item: AuctionItem) => void;
}

const calculateTimeLeft = (endDate: Date) => {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0,
    };

    if (difference > 0) {
        timeLeft = {
            dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
            horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutos: Math.floor((difference / 1000 / 60) % 60),
            segundos: Math.floor((difference / 1000) % 60),
        };
    }
    return timeLeft;
};

const AuctionDetail: React.FC<AuctionDetailProps> = ({ item, user, onBack, onBid, onEditRequest, onPayRequest }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(item.endDate));
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(item.endDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [item.endDate]);

    const isFinished = +new Date(item.endDate) - +new Date() <= 0;
    const isOwner = user.id === item.ownerId;
    const lastBidderId = item.bidHistory.length > 0 ? item.bidHistory[item.bidHistory.length - 1].userId : null;
    const isWinner = isFinished && lastBidderId === user.id;

    
    const handleBidSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= item.currentBid) {
            setError(`Seu lance deve ser maior que R$ ${item.currentBid.toLocaleString('pt-BR')}.`);
            return;
        }
        setError('');
        onBid(item.id, amount);
        setBidAmount('');
    };
    
    const sortedBidHistory = [...item.bidHistory].sort((a, b) => +new Date(b.date) - +new Date(a.date));

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <button onClick={onBack} className="flex items-center text-brand-gold hover:text-yellow-300 mb-6 font-semibold">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Voltar para todos os leilões
            </button>
            <div className="bg-brand-bg-light rounded-lg shadow-xl overflow-hidden relative">
                 {isOwner && !isFinished && (
                    <button 
                        onClick={() => onEditRequest(item)} 
                        className="absolute top-4 right-4 bg-brand-bg-dark p-2 rounded-full text-brand-gold hover:text-yellow-300 hover:bg-gray-700 transition-colors duration-200 z-10"
                        aria-label="Editar leilão"
                    >
                        <PencilIcon className="h-6 w-6"/>
                    </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-auto max-h-[500px] object-contain rounded-lg" />
                    </div>
                    <div className="p-6 flex flex-col">
                        <h1 className="text-3xl font-bold text-white mb-2">{item.title}</h1>
                        <p className="text-brand-gray mb-6">{item.description}</p>

                        <div className="bg-brand-bg-dark rounded-lg p-4 mb-6">
                            {isFinished ? (
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-500">Leilão Encerrado</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-brand-gray mb-2">Tempo Restante</p>
                                    <div className="flex justify-center space-x-4 text-white">
                                        <div><span className="text-3xl font-bold">{timeLeft.dias}</span><span className="text-sm ml-1">d</span></div>
                                        <div><span className="text-3xl font-bold">{String(timeLeft.horas).padStart(2, '0')}</span><span className="text-sm ml-1">h</span></div>
                                        <div><span className="text-3xl font-bold">{String(timeLeft.minutos).padStart(2, '0')}</span><span className="text-sm ml-1">m</span></div>
                                        <div><span className="text-3xl font-bold">{String(timeLeft.segundos).padStart(2, '0')}</span><span className="text-sm ml-1">s</span></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm text-brand-gray">Lance Atual</p>
                                <p className="text-3xl font-bold text-brand-green">R$ {item.currentBid.toLocaleString('pt-BR')}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-brand-gray">Total de Lances</p>
                                <p className="text-lg font-semibold text-white flex items-center justify-end">
                                    <UsersIcon className="h-5 w-5 mr-2" /> {item.bids}
                                </p>
                            </div>
                        </div>

                        {!isFinished && !isOwner && (
                            <form onSubmit={handleBidSubmit} className="mt-auto">
                                <label htmlFor="bid-amount" className="block text-sm font-medium text-brand-gray mb-2">Seu Lance</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        id="bid-amount"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className="block w-full bg-brand-bg-dark border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
                                        placeholder={`Maior que R$ ${item.currentBid.toLocaleString('pt-BR')}`}
                                        min={item.currentBid + 0.01}
                                        step="0.01"
                                        required
                                    />
                                    <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-bg-dark bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-light focus:ring-brand-gold">
                                        Dar Lance
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                            </form>
                        )}
                        
                        {isWinner && !item.paid && (
                            <div className="mt-auto">
                                <p className="text-center text-lg text-green-400 mb-4 font-semibold">Parabéns, você venceu este leilão!</p>
                                <button 
                                    onClick={() => onPayRequest(item)}
                                    className="w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-brand-bg-dark bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-light focus:ring-brand-gold transition-transform transform hover:scale-105"
                                >
                                    Pagar Agora
                                </button>
                            </div>
                        )}

                        {isWinner && item.paid && (
                             <div className="mt-auto text-center bg-green-900 bg-opacity-50 p-4 rounded-lg">
                                <CheckBadgeIcon className="h-10 w-10 text-green-400 mx-auto mb-2" />
                                <p className="font-semibold text-green-400">Pagamento confirmado!</p>
                                <p className="text-sm text-gray-300">Obrigado por sua compra.</p>
                            </div>
                        )}

                        {isFinished && !isWinner && <p className="text-center text-brand-gold font-semibold mt-4">Este leilão foi finalizado.</p>}
                        {isOwner && !isFinished && <p className="text-center text-brand-gray mt-4">Você é o dono deste item. Use o botão de edição acima para fazer alterações.</p>}
                        {isOwner && isFinished && <p className="text-center text-brand-gray mt-4">Você é o dono deste item.</p>}

                    </div>
                </div>
                 <div className="border-t border-gray-700 p-6 mt-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Histórico de Lances</h2>
                    <div className="max-h-60 overflow-y-auto">
                        {sortedBidHistory.length > 0 ? (
                            <ul className="space-y-3">
                                {sortedBidHistory.map((bid, index) => (
                                    <li key={index} className="flex justify-between items-center bg-brand-bg-dark p-3 rounded-md">
                                        <div>
                                            <p className="font-semibold text-white">
                                                {bid.username}{bid.userId === user.id && ' (Você)'}
                                            </p>
                                            <p className="text-sm text-brand-gray">{formatRelativeTime(new Date(bid.date))}</p>
                                        </div>
                                        <p className="font-bold text-brand-green">R$ {bid.amount.toLocaleString('pt-BR')}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-brand-gray text-center">Nenhum lance foi dado ainda.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetail;