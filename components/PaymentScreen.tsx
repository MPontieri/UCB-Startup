import React, { useState } from 'react';
import type { AuctionItem } from '../types';
import { XIcon, CreditCardIcon } from './icons';

interface PaymentScreenProps {
    item: AuctionItem;
    onClose: () => void;
    onConfirmPayment: (itemId: number) => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ item, onClose, onConfirmPayment }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardName || !cardNumber || !expiry || !cvc) {
            alert('Por favor, preencha todos os campos de pagamento.');
            return;
        }
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            onConfirmPayment(item.id);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="payment-title">
            <div className="bg-brand-bg-light rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 id="payment-title" className="text-2xl font-bold text-white">Pagamento</h2>
                            <p className="text-sm text-brand-gray">Item: {item.title}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Fechar">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="my-6 text-center">
                        <p className="text-brand-gray">Valor Total</p>
                        <p className="text-4xl font-bold text-brand-green">R$ {item.currentBid.toLocaleString('pt-BR')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-brand-gray">Nome no Cartão</label>
                            <input type="text" id="cardName" value={cardName} onChange={e => setCardName(e.target.value)} className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                        </div>
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-brand-gray">Número do Cartão</label>
                            <div className="relative">
                                <input type="text" id="cardNumber" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md py-2 px-3 pl-10 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                                <CreditCardIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="expiry" className="block text-sm font-medium text-brand-gray">Validade</label>
                                <input type="text" id="expiry" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/AA" className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                            </div>
                            <div>
                                <label htmlFor="cvc" className="block text-sm font-medium text-brand-gray">CVC</label>
                                <input type="text" id="cvc" value={cvc} onChange={e => setCvc(e.target.value)} placeholder="123" className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold" required />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-brand-bg-dark bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg-light focus:ring-brand-gold disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processando...
                                    </>
                                ) : (
                                    `Pagar R$ ${item.currentBid.toLocaleString('pt-BR')}`
                                )}
                            </button>
                        </div>
                         <p className="text-xs text-center text-gray-500 mt-2">Este é um formulário de pagamento fictício para fins de demonstração.</p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentScreen;