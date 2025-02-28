import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

function App() {
    const [showForm, setShowForm] = useState(false); // ✅ Toggle form visibility
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [message, setMessage] = useState('');
    const [qrValue, setQrValue] = useState(`${window.location.origin}`);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:5000/api/form/submit`, {
                name,
                whatsapp,
            });

            alert(response.data.message);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to submit form. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            {!showForm ? (
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Scan QR Code</h1>
                    
                    <div className="mb-6 flex flex-col items-center">
                        <QRCodeCanvas value={`${window.location.origin}`} size={200} className="mb-4" />
                        <p className="text-sm text-gray-600">Scan this QR code to open the form</p>
                    </div>

                    <button
                        onClick={() => setShowForm(true)} // ✅ Clicking opens the form
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Open Form
                    </button>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Fill the Form</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">WhatsApp Number:</label>
                            <input
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                            Submit
                        </button>
                    </form>

                    {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
                </div>
            )}
        </div>
    );
}

export default App;
