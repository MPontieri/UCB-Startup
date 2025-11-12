import React, { useState, useEffect, useMemo } from 'react';
import type { User, AuctionItem, ToastMessage, Bid } from './types';
import Login from './components/Login';
import Header from './components/Header';
import AuctionGrid from './components/AuctionGrid';
import AuctionDetail from './components/AuctionDetail';
import CreateAuctionForm, { AuctionFormData } from './components/CreateAuctionForm';
import { ToastContainer } from './components/Toast';
import PaymentScreen from './components/PaymentScreen';

const initialUsers: User[] = [
    { id: 1, username: 'ana', password: '123' },
    { id: 2, username: 'bruno', password: '123' },
    { id: 3, username: 'carla', password: '123' },
];

const initialAuctionItems: AuctionItem[] = [
    {
        id: 1,
        title: 'Guitarra Fender Stratocaster Vintage',
        description: 'Uma guitarra clássica de 1978, em perfeito estado. Som lendário que marcou gerações. Ideal para colecionadores e músicos exigentes. Acompanha case original.',
        imageUrl: '/imgs/guitar.jpeg',
        currentBid: 7500,
        endDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
        ownerId: 2, // bruno
        bids: 3,
        bidderIds: [1, 3],
        bidHistory: [
            { userId: 1, username: 'ana', amount: 7000, date: new Date(new Date().getTime() - 2 * 60 * 60 * 1000) },
            { userId: 3, username: 'carla', amount: 7200, date: new Date(new Date().getTime() - 1 * 60 * 60 * 1000) },
            { userId: 1, username: 'ana', amount: 7500, date: new Date(new Date().getTime() - 0.5 * 60 * 60 * 1000) },
        ]
    },
    {
        id: 2,
        title: 'Câmera Leica M6 Analógica',
        description: 'Câmera rangefinder 35mm icônica. Perfeita para fotografia de rua e documental. Corpo em magnésio, visor claro e mecânica impecável. Lente Summicron 35mm f/2 inclusa.',
        imageUrl: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=2070&auto=format&fit=crop',
        currentBid: 12800,
        endDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
        ownerId: 3, // carla
        bids: 3,
        bidderIds: [1, 2],
        bidHistory: [
             { userId: 1, username: 'ana', amount: 12000, date: new Date(new Date().getTime() - 4 * 60 * 60 * 1000) },
             { userId: 2, username: 'bruno', amount: 12500, date: new Date(new Date().getTime() - 2.5 * 60 * 60 * 1000) },
             { userId: 1, username: 'ana', amount: 12800, date: new Date(new Date().getTime() - 1 * 60 * 60 * 1000) },
        ]
    },
    {
        id: 3,
        title: 'Relógio de Colecionador Seiko',
        description: 'Seiko Prospex Diver\'s 200m, edição limitada. Design robusto e clássico, perfeito para mergulho e uso diário. Movimento automático com reserva de marcha de 41 horas.',
        imageUrl: '/imgs/relogio_seiko_skx_5_sports_automatico_bege_srpk31k1_9037_1_c5274d4b96ae817b03e084f3c06c214c_20251003112951.webp',
        currentBid: 2300,
        endDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
        ownerId: 1, // ana
        bids: 1,
        bidderIds: [3],
        bidHistory: [
             { userId: 3, username: 'carla', amount: 2300, date: new Date(new Date().getTime() - 0.2 * 60 * 60 * 1000) },
        ]
    },
    {
        id: 4,
        title: 'Bicicleta de Corrida Pinarello Dogma F12',
        description: 'Bicicleta de estrada de alta performance, usada por equipes profissionais. Quadro de carbono, grupo Shimano Dura-Ace Di2. Extremamente leve e aerodinâmica.',
        imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?q=80&w=1348&auto=format&fit=crop',
        currentBid: 35000,
        endDate: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // Ended yesterday
        ownerId: 3, // carla
        bids: 1,
        bidderIds: [2],
        bidHistory: [
             { userId: 2, username: 'bruno', amount: 35000, date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) },
        ],
        paid: false,
    },
    {
        id: 5,
        title: 'Tênis de Edição Limitada',
        description: 'Par de tênis de colaboração exclusiva, nunca usado. Item de colecionador com design arrojado e materiais premium. Tamanho 42.',
        imageUrl: "/imgs/air-jordan-1-low-x-travis-scott-olive-2.webp",
        currentBid: 850,
        endDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
        ownerId: 1, // ana
        bids: 0,
        bidderIds: [],
        bidHistory: []
    }
];

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [auctionItems, setAuctionItems] = useState<AuctionItem[]>(initialAuctionItems);
    const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<AuctionItem | null>(null);
    const [currentView, setCurrentView] = useState<'all' | 'my-auctions' | 'my-bids'>('all');
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [itemToPay, setItemToPay] = useState<AuctionItem | null>(null);
    
    const [prevMyAuctionsBids, setPrevMyAuctionsBids] = useState<{ [key: number]: number }>({});
    const [prevMyBidsStatus, setPrevMyBidsStatus] = useState<{ [key: number]: { currentBid: number, bidder: number | undefined } }>({});

    const myAuctions = useMemo(() => auctionItems.filter(item => item.ownerId === user?.id).sort((a,b) => +new Date(b.endDate) - +new Date(a.endDate)), [auctionItems, user]);
    const myBidsItems = useMemo(() => auctionItems.filter(item => item.bidderIds.includes(user?.id ?? -1)).sort((a,b) => +new Date(b.endDate) - +new Date(a.endDate)), [auctionItems, user]);
    const allItemsSorted = useMemo(() => [...auctionItems].sort((a,b) => +new Date(a.endDate) - +new Date(b.endDate)), [auctionItems]);

    const myAuctionsNotificationCount = useMemo(() => {
        if (!user) return 0;
        return myAuctions.reduce((count, item) => {
            const prevBids = prevMyAuctionsBids[item.id] ?? 0;
            if (item.bids > prevBids) {
                return count + 1;
            }
            return count;
        }, 0);
    }, [myAuctions, prevMyAuctionsBids, user]);
    
    const myBidsNotificationCount = useMemo(() => {
         if (!user) return 0;
         return myBidsItems.reduce((count, item) => {
            const lastBidderId = item.bidHistory.length > 0 ? item.bidHistory[item.bidHistory.length - 1].userId : undefined;
            const prevStatus = prevMyBidsStatus[item.id];
            
            if (prevStatus && lastBidderId !== user.id && lastBidderId !== prevStatus.bidder && item.currentBid > prevStatus.currentBid) {
                return count + 1;
            }
            return count;
        }, 0);
    }, [myBidsItems, prevMyBidsStatus, user]);

    useEffect(() => {
        if (currentView === 'my-auctions') {
            const newPrevBids = myAuctions.reduce((acc, item) => ({ ...acc, [item.id]: item.bids }), {});
            setPrevMyAuctionsBids(newPrevBids);
        }
    }, [currentView, myAuctions]);

    useEffect(() => {
        if (currentView === 'my-bids') {
            const newPrevStatus = myBidsItems.reduce((acc, item) => ({ ...acc, [item.id]: { currentBid: item.currentBid, bidder: item.bidHistory.length > 0 ? item.bidHistory[item.bidHistory.length-1].userId : undefined } }), {});
            setPrevMyBidsStatus(newPrevStatus);
        }
    }, [currentView, myBidsItems]);

    const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleLogin = (loggedInUser: User) => {
        const completeUser = initialUsers.find(u => u.id === loggedInUser.id || u.username.toLowerCase() === loggedInUser.username.toLowerCase());
        if (completeUser) {
            setUser(completeUser);
            const userAuctions = initialAuctionItems.filter(item => item.ownerId === completeUser.id);
            const userBids = initialAuctionItems.filter(item => item.bidderIds.includes(completeUser.id));
            setPrevMyAuctionsBids(userAuctions.reduce((acc, item) => ({...acc, [item.id]: item.bids }), {}));
            setPrevMyBidsStatus(userBids.reduce((acc, item) => ({ ...acc, [item.id]: { currentBid: item.currentBid, bidder: item.bidHistory.length > 0 ? item.bidHistory[item.bidHistory.length-1].userId : undefined } }), {}));

            addToast(`Bem-vindo, ${completeUser.username}!`, 'success');
        }
    };
    
    const handleLogout = () => {
        setUser(null);
        setSelectedItem(null);
        setCurrentView('all');
        addToast('Você foi desconectado.', 'info');
    };

    const handleSaveAuction = (formData: AuctionFormData) => {
        if (!user) return;
        
        // Editing existing item
        if (editingItem) {
             setAuctionItems(prevItems => prevItems.map(item => {
                if (item.id === editingItem.id) {
                    const updatedItem = {
                        ...item,
                        title: formData.title,
                        description: formData.description,
                        endDate: formData.endDate,
                        currentBid: item.bids > 0 ? item.currentBid : formData.startBid, // Can't change starting bid if bids exist
                        imageUrl: formData.image ? URL.createObjectURL(formData.image) : item.imageUrl,
                    };
                    // if currently viewing the item, update the view
                    if (selectedItem?.id === updatedItem.id) {
                        setSelectedItem(updatedItem);
                    }
                    return updatedItem;
                }
                return item;
             }));
             addToast('Leilão atualizado com sucesso!', 'success');
        } else { // Creating new item
            const newAuctionItem: AuctionItem = {
                id: Math.max(0, ...auctionItems.map(i => i.id)) + 1,
                title: formData.title,
                description: formData.description,
                imageUrl: formData.image ? URL.createObjectURL(formData.image) : '',
                currentBid: formData.startBid,
                endDate: formData.endDate,
                ownerId: user.id,
                bids: 0,
                bidderIds: [],
                bidHistory: []
            };
            setAuctionItems([newAuctionItem, ...auctionItems]);
            addToast('Leilão criado com sucesso!', 'success');
        }
        
        setIsFormOpen(false);
        setEditingItem(null);
        setCurrentView('my-auctions');
    };

    const handleBid = (itemId: number, amount: number) => {
        if (!user) {
            addToast('Você precisa estar logado para dar um lance.', 'error');
            return;
        };

        setAuctionItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === itemId) {
                    const newBid: Bid = {
                        userId: user.id,
                        username: user.username,
                        amount: amount,
                        date: new Date()
                    };
                    const newBidderIds = item.bidderIds.includes(user.id) ? item.bidderIds : [...item.bidderIds, user.id];
                    
                    const updatedItem = {
                        ...item,
                        currentBid: amount,
                        bids: item.bids + 1,
                        bidderIds: newBidderIds,
                        bidHistory: [...item.bidHistory, newBid]
                    };
                    
                    if (selectedItem?.id === itemId) {
                        setSelectedItem(updatedItem);
                    }
                    
                    addToast('Lance realizado com sucesso!', 'success');
                    return updatedItem;
                }
                return item;
            });
        });
    };
    
    const handleStartAuction = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleEditRequest = (item: AuctionItem) => {
        setSelectedItem(null); // Close detail view
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleBack = () => {
        setSelectedItem(null);
    };

    const handlePayRequest = (item: AuctionItem) => {
        setSelectedItem(null); // Close detail view if open
        setItemToPay(item);
    };

    const handleConfirmPayment = (itemId: number) => {
        setAuctionItems(prevItems => prevItems.map(item => {
            if (item.id === itemId) {
                const updatedItem = { ...item, paid: true };
                if (selectedItem?.id === itemId) {
                    setSelectedItem(updatedItem);
                }
                if (itemToPay?.id === itemId) {
                    setItemToPay(updatedItem);
                }
                return updatedItem;
            }
            return item;
        }));
        addToast('Pagamento confirmado com sucesso!', 'success');
        setItemToPay(null);
    };

    const filteredItems = useMemo(() => {
        if (currentView === 'my-auctions') return myAuctions;
        if (currentView === 'my-bids') return myBidsItems;
        return allItemsSorted;
    }, [currentView, myAuctions, myBidsItems, allItemsSorted]);

    if (!user) {
        return <Login onLogin={handleLogin} mockUsers={initialUsers} />;
    }

    return (
        <div className="min-h-screen bg-brand-bg-dark text-white font-sans">
             <ToastContainer toasts={toasts} onDismiss={removeToast} />
            <Header 
                user={user} 
                onLogout={handleLogout} 
                onStartAuction={handleStartAuction}
                currentView={currentView}
                setCurrentView={(view) => {
                    setCurrentView(view);
                    setSelectedItem(null);
                }}
                myAuctionsNotificationCount={myAuctionsNotificationCount}
                myBidsNotificationCount={myBidsNotificationCount}
            />
            <main>
                {selectedItem ? (
                    <AuctionDetail 
                        item={selectedItem} 
                        user={user} 
                        onBack={handleBack} 
                        onBid={handleBid}
                        onEditRequest={handleEditRequest}
                        onPayRequest={handlePayRequest}
                    />
                ) : (
                    <AuctionGrid items={filteredItems} onSelectItem={setSelectedItem} user={user} />
                )}
                {isFormOpen && (
                    <CreateAuctionForm 
                        onClose={() => { setIsFormOpen(false); setEditingItem(null); }}
                        onSave={handleSaveAuction}
                        editingItem={editingItem}
                    />
                )}
                {itemToPay && (
                    <PaymentScreen 
                        item={itemToPay}
                        onClose={() => setItemToPay(null)}
                        onConfirmPayment={handleConfirmPayment}
                    />
                )}
            </main>
        </div>
    );
};

export default App;