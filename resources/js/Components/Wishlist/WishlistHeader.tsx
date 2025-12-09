import React from 'react';
import {Link} from '@inertiajs/react';

interface WishlistHeaderProps {
    currentUserName: string;
    isViewingOwnList: boolean;
}

export default function WishlistHeader({currentUserName, isViewingOwnList}: WishlistHeaderProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    🎄 Bună, {currentUserName}!
                </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-lg mt-1">
                    {isViewingOwnList ? "Lista ta de dorințe pentru Crăciun" : "Vizualizezi lista altcuiva"}
                </p>
                <Link
                    href={"/select-user"}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                    as="button"
                >
                    Schimbă utilizatorul
                </Link>
            </div>
        </div>
    );
}

