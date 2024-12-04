import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, User, Phone } from 'lucide-react';
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
    if (product && customerName !== '' && mobileNumber !== '') {
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
    <div className="flex flex-col h-full bg-[#f3f3f3] border-l border-gray-300">
      <div className="bg-[#2c2c2c] text-white p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">Cart</span>
        </div>
        <span className="text-xs text-gray-300">
          {addedProducts.length} item{addedProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {addedProducts.length === 0 ? (
        <div className="flex-grow flex flex-col justify-center p-4 space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <div className="mb-4">
              <label htmlFor="customerName" className="flex items-center text-xs text-gray-700 mb-1">
                <User size={14} className="mr-2 text-gray-500" />
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full p-2 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="mobileNumber" className="flex items-center text-xs text-gray-700 mb-1">
                <Phone size={14} className="mr-2 text-gray-500" />
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full p-2 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                pattern="[0-9]{10}"
                maxLength="10"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow">
          <div className="flex-grow overflow-y-auto">
            {addedProducts.map((prod) => (
              <div
                key={prod.id}
                className="px-4 py-3 border-b flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex-grow pr-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
                      {prod.name}
                    </h3>
                    <span className="text-xs text-gray-600">
                      ₹ {(prod.price * prod.count - (prod.discount * prod.count || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>₹ {prod.price.toFixed(2)} x {prod.count}</span>
                    {prod.discount > 0 && (
                      <span className="ml-2 text-red-500">
                        Disc: ₹ {(prod.discount * prod.count).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() => decrementCount(prod.id)}
                      onMouseDown={() => startHolding(decrementCount, prod.id)}
                      onMouseUp={stopHolding}
                      onMouseLeave={stopHolding}
                      className="p-1 hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={14} className="text-gray-600" />
                    </button>
                    <span className="px-2 text-xs font-medium text-gray-700">{prod.count}</span>
                    <button
                      onClick={() => incrementCount(prod.id)}
                      onMouseDown={() => startHolding(incrementCount, prod.id)}
                      onMouseUp={stopHolding}
                      onMouseLeave={stopHolding}
                      className="p-1 hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={14} className="text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveProd(prod.id)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border-t p-3 shadow-inner">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600">Discount</span>
              <span className="text-red-500">- ₹ {totalDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600">Tax ({taxRate}%)</span>
              <span>₹ {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-blue-600">₹ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-2 bg-[#f3f3f3]">
            <button
                className="bg-black text-white text-xs p-2 hover:bg-gray-800 transition-colors"
              onClick={() => handlePaymentClick('Cash')}
            >
              Cash [F1]
            </button>
            <button
                className="bg-black text-white text-xs p-2 hover:bg-gray-800 transition-colors"
              onClick={() => handlePaymentClick('Credit Card')}
            >
              Credit Card [F2]
            </button>
            <button
              className="bg-black text-white text-xs p-2 hover:bg-gray-800 transition-colors"
              onClick={() => handlePaymentClick('UPI')}
            >
              UPI [F3]
            </button>
          </div>
        </div>
      )}

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