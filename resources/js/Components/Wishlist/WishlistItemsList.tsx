import React from 'react';
import WishlistItem from './WishlistItem';

interface Item {
    id: number;
    name: string;
    description?: string;
    link?: string;
    status?: 'planning' | 'bought';
    statusInfo?: {
        status: 'planning' | 'bought';
        markedByUserName: string;
    };
}

interface WishlistItemsListProps {
    items: Item[];
    isViewingOwnList: boolean;
    onDeleteItem: (itemId: number) => void;
    onStatusChange: (itemId: number, status: 'planning' | 'bought' | 'none') => void;
}

export default function WishlistItemsList({
                                              items,
                                              isViewingOwnList,
                                              onDeleteItem,
                                              onStatusChange
                                          }: WishlistItemsListProps) {
    if (items.length === 0) {
        return (
            <p className="text-center text-gray-500 text-xl py-8">
                {!isViewingOwnList
                    ? 'Nicio dorință deocamdată'
                    : 'Lista ta este goală. Adaugă ceva ce ți-ai dori!'
                }
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {items.map(item => (
                <WishlistItem
                    key={item.id}
                    item={item}
                    isViewingOwnList={isViewingOwnList}
                    onDelete={onDeleteItem}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
}

