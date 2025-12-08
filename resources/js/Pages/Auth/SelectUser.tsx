import React, { useState, FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
}

interface Props {
    users: User[];
}

export default function SelectUser({ users }: Props) {
    const [showNewUser, setShowNewUser] = useState(false);
    
    const selectForm = useForm({
        user_id: '',
    });

    const createForm = useForm({
        name: '',
    });

    function handleSelectUser(userId: number) {
        selectForm.setData('user_id', userId.toString());
        selectForm.post(route('wishlist.selectUserPost'));
    }

    function handleCreateUser(e: FormEvent) {
        e.preventDefault();
        createForm.post(route('wishlist.createUser'));
    }

    return (
        <>
            <Head title="Who are you?" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-red-600 mb-2">🎅</h1>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Who are you?</h2>
                        <p className="text-gray-600 text-lg">Select your name or add yourself</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {users.map(user => (
                            <button
                                key={user.id}
                                onClick={() => handleSelectUser(user.id)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-6 rounded-lg text-2xl transition-colors"
                            >
                                {user.name}
                            </button>
                        ))}
                    </div>

                    {!showNewUser ? (
                        <button
                            onClick={() => setShowNewUser(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
                        >
                            + Add New Person
                        </button>
                    ) : (
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <input
                                type="text"
                                value={createForm.data.name}
                                onChange={e => createForm.setData('name', e.target.value)}
                                placeholder="Your name"
                                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                            />
                            {createForm.errors.name && (
                                <p className="text-red-600 text-lg">{createForm.errors.name}</p>
                            )}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors disabled:opacity-50"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNewUser(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-lg text-xl transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
