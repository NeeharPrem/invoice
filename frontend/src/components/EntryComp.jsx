import React, { useState, useRef } from 'react';
import products from '../helper/Products';
import Cart from './Cart'

const EntryComp = () => {
    const Categories = ['Electronics', 'Bags', 'Footware', 'Accessories', 'Cloths']

    const productList = Array(12).fill().flatMap(() => products)

    const [visibleProducts, setVisibleProducts] = useState(12)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const scrollableRef = useRef(null);

    const loadMoreProducts = () => {
        if (visibleProducts < productList.length) {
            setVisibleProducts((prev) => Math.min(prev + 12, productList.length));
        }
    };

    const handleScroll = () => {
        const scrollableDiv = scrollableRef.current;
        if (scrollableDiv) {
            const { scrollTop, scrollHeight, clientHeight } = scrollableDiv;
            if (scrollTop + clientHeight >= scrollHeight - 100 && visibleProducts < products.length) {
                loadMoreProducts();
            }
        }
    };

    return (
        <div className="flex h-screen w-full">
            <div className="w-64 bg-gray-50 p-6">
                <h5 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
                    Categories
                </h5>
                {Categories.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => console.log(item)}
                        className="py-2 px-3 hover:bg-gray-100 rounded cursor-pointer text-gray-700 hover:text-blue-600 transition duration-300"
                    >
                        {item}
                    </div>
                ))}
            </div>
            <div className="flex-grow flex flex-col">
                <div className="p-4 bg-white border-b">
                    <input
                        placeholder="Search products..."
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div
                    className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
                    ref={scrollableRef}
                    onScroll={handleScroll}
                    style={{
                        pointerEvents: visibleProducts < productList.length ? 'auto' : 'none',
                    }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {productList.slice(0, visibleProducts).map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-base font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">${product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-96 p-4 bg-gray-50 border-l">
                <Cart product={selectedProduct} />
            </div>
        </div>
    );
};

export default EntryComp;