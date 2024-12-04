import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InvoiceData = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const billData = location.state?.billData;

    useEffect(() => {
        window.electronAPI.onPDFSaved((response) => {
            if (response.success) {
                toast.success('PDF saved successfully');
            } else {
                toast.error('Failed to save PDF');
            }
        });
        return () => {
            window.electronAPI.removeAllListeners('pdf-saved');
        };
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(12);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Billing System Output', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.setFontSize(10);
        doc.text('Bill To:', 20, 60);
        doc.text(`Mr.${billData.name}`, 20, 66);
        doc.text(`${billData.mobile}`, 20, 78);

        doc.autoTable({
            head: [['#', 'Item Name', 'Price', 'Quantity', 'Discount', 'Total']],
            body: billData.products.map((item, index) => [
                index + 1,
                item.name,
                `₹ ${item.price.toFixed(2)}`,
                item.count,
                `₹ ${item.discount.toFixed(2)}`,
                `₹ ${(item.price * item.count - item.discount).toFixed(2)}`
            ]),
            startY: 90,
            theme: 'grid',
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255
            }
        });

        const tableEnd = doc.lastAutoTable.finalY;
        doc.setFontSize(10);
        doc.text('Subtotal:', 140, tableEnd + 10);
        doc.text(`₹ ${billData.subtotal.toFixed(2)}`, 180, tableEnd + 10, { align: 'right' });

        doc.text('Tax Rate:', 140, tableEnd + 16);
        doc.text(`${billData.taxRate}%`, 180, tableEnd + 16, { align: 'right' });

        doc.setFont('helvetica', 'bold');
        doc.text('Total:', 140, tableEnd + 22);
        doc.text(`₹ ${billData.totalPayable.toFixed(2)}`, 180, tableEnd + 22, { align: 'right' });

        const pdfBytes = doc.output('arraybuffer');

        const base64PDF = btoa(String.fromCharCode.apply(null, new Uint8Array(pdfBytes)));
        window.electronAPI.savePDF(base64PDF);
    };

    const renderItemRow = (item, index) => (
        <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
            <td className="p-3 border-b text-gray-700">{index + 1}</td>
            <td className="p-3 border-b font-medium text-gray-800">{item.name}</td>
            <td className="p-3 border-b text-gray-600">₹ {item.price}</td>
            <td className="p-3 border-b text-gray-600">{item.count}</td>
            <td className="p-3 border-b text-red-500">₹ {item.discount}</td>
            <td className="p-3 border-b font-semibold text-green-700">₹ {item.price * item.count}</td>
        </tr>
    );

    return (
        <div className="w-full h-screen flex flex-col p-4 bg-gray-50">
            <div className="flex flex-1 gap-4 overflow-hidden">
                <div className="flex-1 bg-white shadow-xl border border-gray-200 flex flex-col">
                    <div className="bg-blue-600 p-4 border-b">
                        <h2 className="text-lg font-bold text-white">Invoice Details</h2>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    {['No', 'Name', 'Price', 'Qty', 'Disc', 'Amount'].map((header) => (
                                        <th key={header} className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {billData.products.map(renderItemRow)}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-row justify-between p-4 bg-gray-50 text-right text-sm text-gray-600">
                        <div className='flex flex-col items-start'>
                            <p>Subtotal</p>
                            <p>Tax</p>
                            <p className='text-2xl font-semibold'>Total</p>
                        </div>
                        <div className='flex flex-col'>
                            <p>₹ {billData.subtotal}</p>
                            <p>{billData.taxRate} %</p>
                            <p className='text-2xl'>₹ {billData.totalPayable}</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col space-y-4">
                    <div className="bg-white shadow-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-blue-600 mb-4">Customer Information</h3>
                        <div className="space-y-2">
                            <div className="flex flex-col gap-2">
                                <span className="font-medium text-gray-800">{billData.name}</span>
                                <span className="text-gray-500 text-sm">{billData.mobile}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow-xl border border-gray-200 p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-blue-600 mb-4">Payment Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium text-gray-800">Cash</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Amount Paid</span>
                                    <span className="font-semibold text-green-700">₹ {billData.totalPayable}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">₹ {billData.subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold text-red-500">{billData.taxRate} %</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Remaining Amount</span>
                                    <span className="font-semibold text-red-500">{0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex space-x-2">
                            <button onClick={generatePDF} className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition">
                                PDF
                            </button>
                        </div>
                        <button onClick={() => navigate('/')} className="bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition">
                            New Sale
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceData;