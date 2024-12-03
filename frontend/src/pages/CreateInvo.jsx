import React from 'react';
import EntryComp from '../components/EntryComp';

function CreateInvo() {
    return (
        <div className="h-screen w-screen overflow-hidden">
            <div className="lg:col-span-2 sm:col-span-1">
                <EntryComp />
            </div>
        </div>
    );
}

export default CreateInvo;