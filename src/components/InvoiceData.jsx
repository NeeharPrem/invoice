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
                fillColor: [41, 41, 41],
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

    return (
        <div className="flex flex-col h-screen bg-[#f0f0f0] p-1">
            <div className="flex justify-between bg-[#2c2c2c] text-white p-1 pl-2 pr-2">
                <div className="flex items-center space-x-2">
                    <span className="text-sm">Invoice Details</span>
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-2/3 bg-white border-r border-gray-300">
                    <div className="bg-[#e1e1e1] p-2 border-b border-gray-300">
                        <h2 className="text-sm font-semibold">Invoice Items</h2>
                    </div>
                    <div className="overflow-auto h-full">
                        <table className="w-full text-xs">
                            <thead className="bg-[#f0f0f0] sticky top-0">
                                <tr>
                                    {['No', 'Name', 'Price', 'Qty', 'Disc', 'Amount'].map((header) => (
                                        <th key={header} className="p-2 text-left border-b">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {billData.products.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="p-2 border-b">{index + 1}</td>
                                        <td className="p-2 border-b">{item.name}</td>
                                        <td className="p-2 border-b">₹ {item.price}</td>
                                        <td className="p-2 border-b">{item.count}</td>
                                        <td className="p-2 border-b text-red-500">₹ {item.discount}</td>
                                        <td className="p-2 border-b font-semibold">₹ {item.price * item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-1/3 flex flex-col">
                    <div className="bg-white border-b border-gray-300">
                        <div className="bg-[#e1e1e1] p-2 border-b border-gray-300">
                            <h3 className="text-sm font-semibold">Customer</h3>
                        </div>
                        <div className="p-3 text-xs">
                            <div className="mb-2">
                                <span className="font-semibold">Name:</span> {billData.name}
                            </div>
                            <div>
                                <span className="font-semibold">Mobile:</span> {billData.mobile}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white flex-1">
                        <div className="bg-[#e1e1e1] p-2 border-b border-gray-300">
                            <h3 className="text-sm font-semibold">Payment Summary</h3>
                        </div>
                        <div className="p-3 text-xs">
                            <div className="flex justify-between mb-1">
                                <span>Subtotal</span>
                                <span>₹ {billData.subtotal}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span>Tax ({billData.taxRate}%)</span>
                                <span className="text-red-500">+ ₹ {(billData.subtotal * billData.taxRate / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold mt-2 border-t pt-2">
                                <span>Total</span>
                                <span>₹ {billData.totalPayable}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#e1e1e1] p-2 flex justify-between">
                        <button
                            onClick={generatePDF}
                            className="bg-[#0078d7] w-30 h-12 text-white text-xs px-3 py-1 hover:bg-[#005a9e] transition"
                        >
                            Generate PDF
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-[#4CAF50] w-30 h-12 text-white text-xs px-3 py-1 hover:bg-[#45a049] transition"
                        >
                            New Sale
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default InvoiceData;