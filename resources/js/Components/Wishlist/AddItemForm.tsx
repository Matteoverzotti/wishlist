import React from 'react';
import {Form} from '@inertiajs/react';

interface AddItemFormProps {
    onSubmit: (e: React.FormEvent) => void;
}

export default function AddItemForm({onSubmit}: AddItemFormProps) {
    return (
        <Form
            action={route("wishlist.addItem")}
            method="POST"
            onSubmit={onSubmit}
            className="mb-6 p-6 bg-blue-50 rounded-lg space-y-4"
        >
            {({errors, processing}) => (
                <>
                    <input
                        type="text"
                        name="name"
                        placeholder="Numele cadoului *"
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                    {errors.name && (
                        <p className="mt-2 text-red-600 text-lg">{errors.name}</p>
                    )}

                    <textarea
                        name="description"
                        placeholder="Descriere (opțional)"
                        rows={3}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                        type="url"
                        name="link"
                        placeholder="Link (opțional)"
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.link && (
                        <p className="mt-2 text-red-600 text-lg">{errors.link}</p>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-50"
                    >
                        Adaugă la lista de dorințe
                    </button>
                </>
            )}
        </Form>
    );
}

