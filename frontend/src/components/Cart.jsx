import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = ({ product }) => {
  const [addedProducts, setAddedProducts] = useState([]);
  const intervalRef = useRef(null);
  const isHolding = useRef(false);

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
      prevProducts.map((prod) =>
        prod.id === productId && prod.count > 1
          ? { ...prod, count: prod.count - 1 }
          : prod
      ).filter((prod) => prod.count > 0)
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

  const calculateTotal = () => {
    return addedProducts.reduce((total, prod) => total + (prod.price * prod.count), 0).toFixed(2);
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
            <p className="text-center text-gray-500">Cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto divide-y divide-gray-200">
              {addedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{prod.name}</h3>
                    <p className="text-sm text-gray-600">₹{prod.price.toFixed(2)}</p>
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
                <span className="text-xl font-bold text-blue-600">₹ {calculateTotal()}</span>
              </div>
              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;