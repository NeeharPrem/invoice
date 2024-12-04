import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import CashModal from '../modal/CashModal';

const Cart = ({ product }) => {
  const [addedProducts, setAddedProducts] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [taxRate] = useState(10);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const intervalRef = useRef(null);
  const isHolding = useRef(false);
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    if (window.electronAPI) {
      const handlePaymentMethod = (method) => {
        setPaymentMode(method);
        setIsModalOpen(true);
      };

      window.electronAPI.onPaymentMethod(handlePaymentMethod);
    }
  }, []);

  useEffect(() => {
    if (product) {
      setAddedProducts((prevProducts) => {
        const existingProductIndex = prevProducts.findIndex((p) => p.id === product.id);

        if (existingProductIndex >= 0) {
          const updatedProducts = [...prevProducts];
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            count: updatedProducts[existingProductIndex].count + 1
          };
          return updatedProducts;
        } else {
          return [...prevProducts, { ...product, count: 1 }];
        }
      });
    }
  }, [product]);

  const incrementCount = (productId) => {
    setAddedProducts((prevProducts) =>
      prevProducts.map((prod) =>
        prod.id === productId
          ? { ...prod, count: prod.count + 1 }
          : prod
      )
    );
  };

  const decrementCount = (productId) => {
    setAddedProducts((prevProducts) =>
      prevProducts
        .map((prod) =>
          prod.id === productId && prod.count > 1
            ? { ...prod, count: prod.count - 1 }
            : prod
        )
        .filter((prod) => prod.count > 0)
    );
  };

  const startHolding = (action, productId) => {
    if (!isHolding.current) {
      isHolding.current = true;
      intervalRef.current = setInterval(() => {
        action(productId);
      }, 200);
    }
  };

  const stopHolding = () => {
    clearInterval(intervalRef.current);
    isHolding.current = false;
  };

  const handleRemoveProd = (productId) => {
    setAddedProducts((prevProducts) => {
      return prevProducts.filter((prod) => prod.id !== productId);
    });
  };

  useEffect(() => {
    const rawSubtotal = addedProducts.reduce(
      (total, prod) => total + prod.price * prod.count,
      0
    );

    const discounts = addedProducts.reduce(
      (total, prod) => {
        const productDiscount = prod.discount ? prod.discount * prod.count : 0;
        return total + productDiscount;
      },
      0
    );

    const subtotalAfterDiscount = rawSubtotal - discounts;

    const calculatedTax = (subtotalAfterDiscount * taxRate) / 100;

    setSubtotal(rawSubtotal);
    setTotalDiscount(discounts);
    setTaxAmount(calculatedTax);
    setTotal(subtotalAfterDiscount + calculatedTax);
  }, [addedProducts, taxRate]);

  const handlePaymentClick = (mode) => {
    setPaymentMode(mode);
    setIsModalOpen(true);
  };

  const handleReset = () => {
    setAddedProducts([]);
    setSubtotal(0);
    setTotalDiscount(0);
    setTaxAmount(0);
    setTotal(0);
    setCustomerName(''); 
    setMobileNumber(''); 
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white flex-grow w-96 mx-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">Cart</h3>
          <span className="text-sm text-gray-500">
            {addedProducts.length} item{addedProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {addedProducts.length === 0 ? (
          <div className="flex items-center justify-center flex-grow">
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    id="customerName"
                    type="text"
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input
                    id="mobileNumber"
                    type="number"
                    placeholder="Enter mobile number"
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* <p className="text-center text-gray-500">Cart is empty</p> */}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-col h-[70vh] overflow-y-scroll divide-y divide-gray-200 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
              {addedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{prod.name}</h3>
                    <p className="text-sm text-gray-600">
                      ₹ {prod.price.toFixed(2)} x {prod.count}
                    </p>
                    {prod.discount > 0 && (
                      <p className="text-sm text-red-500">
                        Discount per item: ₹ {prod.discount.toFixed(2)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Total: ₹ {(prod.price * prod.count - (prod.discount * prod.count || 0)).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border rounded-full overflow-hidden">
                      <button
                        onClick={() => decrementCount(prod.id)}
                        onMouseDown={() => startHolding(decrementCount, prod.id)}
                        onMouseUp={stopHolding}
                        onMouseLeave={stopHolding}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={16} className="text-gray-600" />
                      </button>
                      <span className="px-3 text-sm font-medium text-gray-700">{prod.count}</span>
                      <button
                        onClick={() => incrementCount(prod.id)}
                        onMouseDown={() => startHolding(incrementCount, prod.id)}
                        onMouseUp={stopHolding}
                        onMouseLeave={stopHolding}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveProd(prod.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t sticky bottom-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-blue-600">₹ {total.toFixed(2)}</span>
              </div>
              <div className="flex flex-row gap-2 justify-between">
                <button
                  className="bg-gray-600 text-white p-3 hover:bg-gray-700 transition-colors"
                  onClick={() => handlePaymentClick('Cash')}
                >
                  Cash [F1]
                </button>
                <button
                  className="bg-gray-600 text-white p-3 hover:bg-gray-700 transition-colors"
                  onClick={() => handlePaymentClick('Credit Card')}
                >
                  Credit Card [F2]
                </button>
                <button
                  className="bg-gray-600 text-white p-3 hover:bg-gray-700 transition-colors"
                  onClick={() => handlePaymentClick('UPI')}
                >
                  UPI [F3]
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <CashModal
          reset={handleReset}
          data={addedProducts}
          subtotal={subtotal}
          discountTotal={totalDiscount}
          taxRate={taxRate}
          taxAmount={taxAmount}
          total={total}
          mode={paymentMode}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          name={customerName} 
          mobile={mobileNumber}
        />
      )}
    </div>
  );
};

export default Cart;