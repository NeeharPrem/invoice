import React from 'react';

const Cart = React.memo(({ product }) => {
    return (
      <div className="p-4 border rounded h-full w-full">
        {!product ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No product selected
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <p className="text-sm text-gray-700">Price: ${product.price}</p>
            <p className="text-sm text-gray-500">{product.description}</p>
          </div>
        )}
      </div>
    );
  },
  (prevProp, nextProp) =>
    prevProp.product?.id === nextProp.product?.id
);

export default Cart;