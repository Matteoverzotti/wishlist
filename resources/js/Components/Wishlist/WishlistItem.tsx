import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface WishlistItemProps {
    item: {
        id: number;
        name: string;
        description?: string;
        link?: string;
        status?: 'planning' | 'bought';
        statusInfo?: {
            status: 'planning' | 'bought';
            markedByUserName: string;
        };
    };
    isViewingOwnList: boolean;
    onDelete: (itemId: number) => void;
    onStatusChange: (itemId: number, status: 'planning' | 'bought' | 'none') => void;
}

export default function WishlistItem({item, isViewingOwnList, onDelete, onStatusChange}: WishlistItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: item.name,
        description: item.description || '',
        link: item.link || '',
    });

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('wishlist.updateItem', item.id), {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const cancelEdit = () => {
        reset();
        setIsEditing(false);
    };

    // Check if someone else has marked this (statusInfo exists but you haven't marked it)
    const markedByOther = item.statusInfo && !item.status;

    // Determine background color based on status
    let cardClassName = "border-2 border-gray-200 rounded-lg p-6";
    if (!isViewingOwnList && item.statusInfo) {
        if (item.statusInfo.status === 'bought') {
            cardClassName = "border-2 border-green-400 bg-green-100 rounded-lg p-6";
        } else if (item.statusInfo.status === 'planning') {
            cardClassName = "border-2 border-yellow-400 bg-yellow-100 rounded-lg p-6";
        }
    }

    return (
        <div className={cardClassName}>
            {/* Status Banner */}
            {!isViewingOwnList && item.statusInfo && (
                <div className={`mb-4 p-3 rounded-lg font-bold text-lg ${
                    item.statusInfo.status === 'bought'
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-500 text-white'
                }`}>
                    {item.statusInfo.status === 'bought'
                        ? `✓ Cumpărat de ${item.statusInfo.markedByUserName}`
                        : `📋 ${item.statusInfo.markedByUserName} plănuiește să cumpere`
                    }
                </div>
            )}

            {isEditing ? (
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nume cadou *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descriere
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                        />
                        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link
                        </label>
                        <input
                            type="url"
                            value={data.link}
                            onChange={(e) => setData('link', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://..."
                        />
                        {errors.link && <p className="text-red-600 text-sm mt-1">{errors.link}</p>}
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50"
                        >
                            Salvează
                        </button>
                        <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={processing}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium disabled:opacity-50"
                        >
                            Anulează
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>
                            {item.description && (
                                <p className="text-gray-600 text-lg mb-2">{item.description}</p>
                            )}
                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-lg underline"
                                >
                                    Vezi link
                                </a>
                            )}
                        </div>
                        {isViewingOwnList && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-600 hover:text-blue-800 font-bold text-xl"
                                    title="Editează"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="text-red-600 hover:text-red-800 font-bold text-xl"
                                    title="Șterge"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Status buttons for other users' items */}
            {!isViewingOwnList && !isEditing && (
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => onStatusChange(item.id, item.status === 'planning' ? 'none' : 'planning')}
                        className={`flex-1 py-3 px-4 rounded-lg text-lg font-bold transition-colors ${
                            item.status === 'planning'
                                ? 'bg-yellow-500 text-white'
                                : markedByOther
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                        disabled={markedByOther}
                    >
                        {item.status === 'planning' ? '✓ Plănuiesc să cumpăr' : 'Plănuiesc să cumpăr'}
                    </button>
                    <button
                        onClick={() => onStatusChange(item.id, item.status === 'bought' ? 'none' : 'bought')}
                        className={`flex-1 py-3 px-4 rounded-lg text-lg font-bold transition-colors ${
                            item.status === 'bought'
                                ? 'bg-green-600 text-white'
                                : markedByOther
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                        disabled={markedByOther}
                    >
                        {item.status === 'bought' ? '✓ Cumpărat' : 'Marchează ca cumpărat'}
                    </button>
                </div>
            )}
        </div>
    );
}

