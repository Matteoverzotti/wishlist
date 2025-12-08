import React, {useState} from 'react';
import {Form, Head, usePage} from '@inertiajs/react';

export default function Access() {
    const [password, setPassword] = useState('');
    const { errors } = usePage().props as { errors: Record<string, string> };
    const errorMessage = errors.password ? errors.password : '';
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-red-600 mb-2">🎄</h1>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Listă de Crăciun</h2>
                        <p className="text-gray-600 text-lg">Introdu parola de acces</p>
                    </div>

                    <Form action="/access" method="POST">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Parola"
                                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                autoFocus
                                name="password"
                            />
                            {errorMessage && (
                                <p className="mt-2 text-red-600 text-lg">{errorMessage}</p>
                            )}
                        </div>
                        <br/>

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors disabled:opacity-50"
                        >
                            Enter
                        </button>
                    </Form>
                </div>
            </div>
        </>
    );
}
