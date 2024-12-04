import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { X, Circle } from 'lucide-react';
import { saveBillToDB } from '../helper/billData';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const CashModal = ({ reset, data, subtotal, discountTotal, taxRate, taxAmount, total, mode, isOpen, onClose,name,mobile}) => {

    const navigate = useNavigate()

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            proceedWithBill();
        }
        if (event.key === 'x') {
            onClose();
        }
    };

    const proceedWithBill = () => {
        const saveData= {
            products: data,
            paymentMode:mode,
            subtotal:subtotal,
            discountTotal:discountTotal,
            taxRate:taxRate,
            taxAmount:taxAmount,
            totalPayable:total,
            date:new Date(),
            name:name,
            mobile:mobile
        }
        let status = saveBillToDB(saveData)
        if(status){
            toast.success(`₹ ${total} added via ${mode}`)
            navigate('/invoice', { state: { billData: saveData } })
            reset()
        }else{
            toast.error(`Payment failed`)
        }
        onClose();
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyPress);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Cash Modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
        >
            <div className="relative w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                        <Circle fill="green" color="green" size={12} />
                        Transaction
                    </h2>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">Payment type</div>
                        <div className="text-right font-semibold">{mode}</div>
                        <div className="text-gray-600">Total Amount</div>
                        <div className="text-right font-semibold">₹ {total}</div>

                        <div className="text-gray-600">Amount Received</div>
                        <div className="text-right font-semibold text-green-600">₹ {total}</div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Still Remaining</span>
                        <span className="font-bold text-green-600">₹0.00</span>
                    </div>

                    <button
                        onClick={proceedWithBill}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-md"
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CashModal;