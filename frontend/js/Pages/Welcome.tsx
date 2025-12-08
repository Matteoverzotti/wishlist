import React from 'react';
import { Head } from '@inertiajs/react';
import BucharestMap from '../Components/BucharestMap';
import { PageProps } from '../../types';

const Welcome: React.FC<PageProps> = ({ appName, locations }) => {
    return (
        <div className="h-screen w-screen overflow-hidden">
            <Head title="Bucharest Map" />
            <BucharestMap locations={locations} />
        </div>
    );
};

export default Welcome;