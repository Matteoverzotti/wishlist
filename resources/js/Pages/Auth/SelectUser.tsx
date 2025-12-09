import React, {useState, FormEvent} from 'react';
import {Form, Head, Link, useForm} from '@inertiajs/react';

interface User {
    id: number;
    name: string;
}

interface Props {
    users: User[];
}

export default function SelectUser({users}: Props) {
    const [showNewUser, setShowNewUser] = useState(false);

    const selectForm = useForm({
        user_id: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        selectForm.post('/select-user');
    }

    return (
        <>
            <Head title="Cum te numești?"/>
            <div
                className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-red-600 mb-2">🎅</h1>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cum te numești?</h2>
                        <p className="text-gray-600 text-lg">Selectează numele tău din listă sau adaugă-te!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {users.map(user => (
                            <form onSubmit={handleSubmit}>
                                <button
                                    key={user.id}
                                    onClick={() => selectForm.setData('user_id', user.id.toString())}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-6 rounded-lg text-2xl transition-colors w-full"
                                >
                                    {user.name}
                                </button>
                            </form>
                        ))}
                    </div>

                    {!showNewUser ? (
                        <button
                            onClick={() => setShowNewUser(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
                        >
                            + Adaugă persoană nouă
                        </button>
                    ) : (
                        <Form action={"/create-user"} method="POST" className="space-y-4">
                            {({
                                  errors, processing
                              }) => (
                                <>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Numele tău"
                                        className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-lg">{errors.name}</p>
                                    )}
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors disabled:opacity-50"
                                        >
                                            Creează
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowNewUser(false)}
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-lg text-xl transition-colors"
                                        >
                                            Anulează
                                        </button>
                                    </div>
                                </>
                            )}

                        </Form>
                    )}
                </div>
                <Link href={"/logout"} method="post" as="button"
                      className="fixed right-6 top-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-lg text-lg transition-colors">
                    🚪 Deconectează-te
                </Link>
            </div>
        </>
    );
}
