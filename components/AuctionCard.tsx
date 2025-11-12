import React, { useState, useEffect } from 'react';
import type { AuctionItem, User } from '../types';
import { ClockIcon, TagIcon, UsersIcon, CheckBadgeIcon } from './icons';

interface AuctionCardProps {
    item: AuctionItem;
    onSelect: (item: AuctionItem) => void;
    currentUser: User | null;
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

const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-brand-light">{value.toString().padStart(2, '0')}</span>
        <span className="text-xs text-brand-gray">{label}</span>
    </div>
);

const AuctionCard: React.FC<AuctionCardProps> = ({ item, onSelect, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(item.endDate));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(item.endDate));
        }, 1000);

        return () => clearTimeout(timer);
    });

    const isFinished = +new Date(item.endDate) - +new Date() <= 0;
    const lastBidderId = item.bidHistory.length > 0 ? item.bidHistory[item.bidHistory.length - 1].userId : null;
    const isWinner = isFinished && lastBidderId === currentUser?.id;


    return (
        <div 
            onClick={() => onSelect(item)} 
            className="bg-brand-bg-light rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer h-full"
            role="button"
            aria-label={`Ver detalhes de ${item.title}`}
        >
            <div className="relative">
                <img className="w-full h-56 object-cover" src={item.imageUrl} alt={item.title} />
                 <div className={`absolute top-0 right-0 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold ${isFinished ? 'bg-red-700' : 'bg-brand-green-dark'}`}>
                    {isFinished ? 'Finalizado' : 'Ativo'}
                </div>
                {isWinner && !item.paid && (
                    <div className="absolute top-2 left-2 bg-brand-gold text-brand-bg-dark px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        Pagamento Pendente
                    </div>
                )}
                 {isWinner && item.paid && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
                        <CheckBadgeIcon className="h-4 w-4 mr-1"/> Pago
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-brand-light truncate">{item.title}</h3>
                <p className="text-sm text-brand-gray mt-1 flex-grow h-16 overflow-hidden">{item.description}</p>
                
                <div className="mt-4 flex justify-between items-center text-sm text-brand-gray">
                    <div className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-1"/> Lance Atual
                    </div>
                    <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-1"/> {item.bids} lances
                    </div>
                </div>
                <p className="text-2xl font-bold text-brand-green mt-1">R$ {item.currentBid.toLocaleString('pt-BR')}</p>
                
                <div className="mt-auto border-t border-gray-700 pt-3">
                    <div className="flex justify-around">
                       {isFinished ? 
                         <span className="text-red-500 font-bold">Leilão Encerrado</span>
                         :
                         <>
                            <TimeBlock value={timeLeft.dias} label="dias" />
                            <TimeBlock value={timeLeft.horas} label="horas" />
                            <TimeBlock value={timeLeft.minutos} label="min" />
                            <TimeBlock value={timeLeft.segundos} label="seg" />
                         </>
                       }
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuctionCard;