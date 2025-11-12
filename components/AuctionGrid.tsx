import React from 'react';
import type { AuctionItem, User } from '../types';
import AuctionCard from './AuctionCard';

interface AuctionGridProps {
    items: AuctionItem[];
    onSelectItem: (item: AuctionItem) => void;
    user: User | null;
}

const AuctionGrid: React.FC<AuctionGridProps> = ({ items, onSelectItem, user }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
             {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <AuctionCard key={item.id} item={item} onSelect={onSelectItem} currentUser={user} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-semibold text-white">Nenhum leilão encontrado.</h3>
                    <p className="text-brand-gray mt-2">Não há leilões que correspondam à sua seleção atual.</p>
                </div>
            )}
        </div>
    );
};

export default AuctionGrid;