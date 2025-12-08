import React, { useState, FormEvent } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

interface Item {
    id: number;
    name: string;
    description?: string;
    link?: string;
    status?: 'planning' | 'bought';
    hasStatus?: boolean;
}

interface User {
    id: number;
    name: string;
    items: Item[];
}

interface Props {
    currentUser: { id: number; name: string };
    users: User[];
}

export default function Index({ currentUser, users }: Props) {
    const [showAddItem, setShowAddItem] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const addForm = useForm({
        name: '',
        description: '',
        link: '',
    });

    function handleAddItem(e: FormEvent) {
        e.preventDefault();
        addForm.post(route('wishlist.addItem'), {
            onSuccess: () => {
                addForm.reset();
                setShowAddItem(false);
            },
        });
    }

    function handleDeleteItem(itemId: number) {
        if (confirm('Are you sure you want to delete this item?')) {
            router.delete(route('wishlist.deleteItem', itemId));
        }
    }

    function handleStatusChange(itemId: number, status: 'planning' | 'bought' | 'none') {
        router.patch(route('wishlist.updateStatus', itemId), { status });
    }

    function handleLogout() {
        router.post(route('wishlist.logout'));
    }

    const currentUserData = users.find(u => u.id === currentUser.id);
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    const displayUser = selectedUserId 
        ? users.find(u => u.id === selectedUserId)
        : currentUserData;

    return (
        <>
            <Head title="My Wishlist" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    🎄 Hello, {currentUser.name}!
                                </h1>
                                <p className="text-gray-600 text-lg mt-1">
                                    {selectedUserId ? "Viewing someone's wishlist" : "Your wishlist"}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                            >
                                Switch User
                            </button>
                        </div>
                    </div>

                    {/* User Selection */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">View Wishlist</h2>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedUserId(null)}
                                className={`py-3 px-6 rounded-lg text-lg font-bold transition-colors ${
                                    !selectedUserId
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                My List
                            </button>
                            {otherUsers.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => setSelectedUserId(user.id)}
                                    className={`py-3 px-6 rounded-lg text-lg font-bold transition-colors ${
                                        selectedUserId === user.id
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                >
                                    {user.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wishlist Items */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {selectedUserId ? `${displayUser?.name}'s Wishes` : 'My Wishes'}
                            </h2>
                            {!selectedUserId && (
                                <button
                                    onClick={() => setShowAddItem(!showAddItem)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                                >
                                    {showAddItem ? 'Cancel' : '+ Add Item'}
                                </button>
                            )}
                        </div>

                        {/* Add Item Form */}
                        {showAddItem && !selectedUserId && (
                            <form onSubmit={handleAddItem} className="mb-6 p-6 bg-blue-50 rounded-lg space-y-4">
                                <input
                                    type="text"
                                    value={addForm.data.name}
                                    onChange={e => addForm.setData('name', e.target.value)}
                                    placeholder="Item name *"
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                <textarea
                                    value={addForm.data.description}
                                    onChange={e => addForm.setData('description', e.target.value)}
                                    placeholder="Description (optional)"
                                    rows={3}
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                    type="url"
                                    value={addForm.data.link}
                                    onChange={e => addForm.setData('link', e.target.value)}
                                    placeholder="Link (optional)"
                                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-50"
                                >
                                    Add to My Wishlist
                                </button>
                            </form>
                        )}

                        {/* Items List */}
                        <div className="space-y-4">
                            {displayUser?.items.length === 0 ? (
                                <p className="text-center text-gray-500 text-xl py-8">
                                    {selectedUserId ? 'No items yet' : 'Your wishlist is empty. Add some items!'}
                                </p>
                            ) : (
                                displayUser?.items.map(item => (
                                    <div key={item.id} className="border-2 border-gray-200 rounded-lg p-6">
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
                                                        View Link
                                                    </a>
                                                )}
                                            </div>
                                            {!selectedUserId && (
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="text-red-600 hover:text-red-800 font-bold text-xl ml-4"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>

                                        {/* Status buttons for other users' items */}
                                        {selectedUserId && (
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => handleStatusChange(item.id, item.status === 'planning' ? 'none' : 'planning')}
                                                    className={`flex-1 py-3 px-4 rounded-lg text-lg font-bold transition-colors ${
                                                        item.status === 'planning'
                                                            ? 'bg-yellow-500 text-white'
                                                            : item.hasStatus
                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                    }`}
                                                    disabled={item.hasStatus && item.status !== 'planning'}
                                                >
                                                    {item.status === 'planning' ? '✓ Planning to Buy' : 'Plan to Buy'}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(item.id, item.status === 'bought' ? 'none' : 'bought')}
                                                    className={`flex-1 py-3 px-4 rounded-lg text-lg font-bold transition-colors ${
                                                        item.status === 'bought'
                                                            ? 'bg-green-600 text-white'
                                                            : item.hasStatus
                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    }`}
                                                    disabled={item.hasStatus && item.status !== 'bought'}
                                                >
                                                    {item.status === 'bought' ? '✓ Bought' : 'Mark as Bought'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
