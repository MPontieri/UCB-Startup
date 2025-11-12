import React, { useState, useRef, useEffect } from 'react';
import { XIcon, CameraIcon } from './icons';
import type { AuctionItem } from '../types';

export interface AuctionFormData {
    title: string;
    description: string;
    image?: File;
    endDate: Date;
    startBid: number;
}

interface CreateAuctionFormProps {
    onClose: () => void;
    onSave: (item: AuctionFormData) => void;
    editingItem?: AuctionItem | null;
}

const CreateAuctionForm: React.FC<CreateAuctionFormProps> = ({ onClose, onSave, editingItem }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('23:59');
    const [startBid, setStartBid] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!editingItem;
    const hasBids = isEditMode && editingItem.bids > 0;

    useEffect(() => {
        if (editingItem) {
            setTitle(editingItem.title);
            setDescription(editingItem.description);
            setImagePreview(editingItem.imageUrl);
            
            const d = new Date(editingItem.endDate);
            setEndDate(d.toISOString().split('T')[0]);
            setEndTime(d.toTimeString().substring(0, 5));
            setStartBid(String(editingItem.currentBid));
        }
    }, [editingItem]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formImage = image; // The new file, if any
        if (!title || !description || (!formImage && !isEditMode) || !endDate || !startBid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const combinedDateTime = new Date(`${endDate}T${endTime}`);
        if (combinedDateTime <= new Date() && !hasBids) {
            alert('A data de término do leilão deve ser no futuro.');
            return;
        }

        const formData: AuctionFormData = {
            title,
            description,
            endDate: combinedDateTime,
            startBid: parseFloat(startBid),
        };

        if (formImage) {
            formData.image = formImage;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-brand-bg-light rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 relative">
                    <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Editar Leilão' : 'Criar Novo Leilão'}</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                        <XIcon className="h-6 w-6" />
                    </button>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-brand-gray">Título</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-brand-gray">Descrição</label>
                            <textarea
                                id="description"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-gray">Imagem do Item</label>
                            <div
                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="space-y-1 text-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md" />
                                    ) : (
                                        <>
                                            <CameraIcon className="mx-auto h-12 w-12 text-gray-500" />
                                            <div className="flex text-sm text-gray-400">
                                                <p className="pl-1">Clique para carregar uma imagem</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                                        </>
                                    )}
                                    <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" required={!isEditMode}/>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="end-date" className="block text-sm font-medium text-brand-gray">Data de Término</label>
                                <input
                                    type="date"
                                    id="end-date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                    disabled={hasBids}
                                />
                            </div>
                            <div>
                                <label htmlFor="end-time" className="block text-sm font-medium text-brand-gray">Hora</label>
                                <input
                                    type="time"
                                    id="end-time"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                    disabled={hasBids}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="start-bid" className="block text-sm font-medium text-brand-gray">Lance Inicial (R$)</label>
                            <input
                                type="number"
                                id="start-bid"
                                value={startBid}
                                onChange={(e) => setStartBid(e.target.value)}
                                min="0.01"
                                step="0.01"
                                className="mt-1 block w-full bg-brand-bg-dark border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-gold focus:border-brand-gold disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="ex: 50.00"
                                required
                                disabled={hasBids}
                            />
                        </div>
                        {hasBids && <p className="text-xs text-amber-500 text-center">O lance inicial e a data de término não podem ser alterados pois este item já possui lances.</p>}

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4">
                                Cancelar
                            </button>
                            <button type="submit" className="bg-brand-gold hover:bg-yellow-400 text-brand-bg-dark font-bold py-2 px-4 rounded">
                                {isEditMode ? 'Salvar Alterações' : 'Iniciar Leilão'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAuctionForm;