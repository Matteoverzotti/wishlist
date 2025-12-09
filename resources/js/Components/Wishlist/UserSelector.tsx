import React from 'react';

interface User {
    id: number;
    name: string;
}

interface UserSelectorProps {
    otherUsers: User[];
    selectedUserId: number | null;
    onSelectUser: (userId: number | null) => void;
}

export default function UserSelector({otherUsers, selectedUserId, onSelectUser}: UserSelectorProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Selectează lista de cadouri</h2>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => onSelectUser(null)}
                    className={`py-3 px-6 rounded-lg text-lg font-bold transition-colors ${
                        !selectedUserId
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                    Lista mea
                </button>
                {otherUsers.map(user => (
                    <button
                        key={user.id}
                        onClick={() => onSelectUser(user.id)}
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
    );
}

