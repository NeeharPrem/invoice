import React, { useState, useRef, useEffect } from 'react';
import products from '../helper/Products';
import Cart from './Cart';

const EntryComp = () => {
    const Categories = ['Electronics', 'Bags', 'Footwear', 'Accessories', 'Cloths'];

    const [visibleProducts, setVisibleProducts] = useState(12);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(Categories[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
    const [categoryProducts, setCategoryProducts] = useState([]);

    const scrollableRef = useRef(null);
    const searchRef = useRef(null);
    const searchResultsRef = useRef([]);

    useEffect(() => {
        const initialProducts = products.filter(
            (product) => product.category === selectedCategory
        );
        setCategoryProducts(initialProducts);
    }, [selectedCategory]);

    useEffect(() => {
        if (window.electronAPI) {
            const handleSearchFocus = () => {
                if (searchRef.current) {
                    searchRef.current.focus();
                }
            };
            window.electronAPI.onSearchFocus(handleSearchFocus);
        }
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSelectedSearchIndex(-1);

        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(results);
    };

    const handleKeyDown = (e) => {
        if (searchResults.length > 0) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedSearchIndex(prev => {
                        const newIndex = Math.min(prev + 1, searchResults.length - 1);
                        scrollToItem(newIndex);
                        return newIndex;
                    });
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedSearchIndex(prev => {
                        const newIndex = Math.max(prev - 1, 0);
                        scrollToItem(newIndex);
                        return newIndex;
                    });
                    break;
                case 'Enter':
                    if (selectedSearchIndex >= 0 && selectedSearchIndex < searchResults.length) {
                        const selectedProduct = searchResults[selectedSearchIndex];
                        handleProductSelection(selectedProduct);
                    }
                    break;
                case 'Escape':
                    setSearchQuery('');
                    setSearchResults([]);
                    setSelectedSearchIndex(-1);
                    break;
            }
        }
    };

    const scrollToItem = (index) => {
        if (searchResultsRef.current && searchResultsRef.current[index]) {
            searchResultsRef.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    };

    const handleProductSelection = (product) => {
        setSelectedProduct({ ...product, timestamp: Date.now() });
        setSelectedCategory(product.category);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedSearchIndex(-1);
    };

    const displayProducts = searchQuery.trim()
        ? searchResults
        : categoryProducts;

    const loadMoreProducts = () => {
        if (visibleProducts < displayProducts.length) {
            setVisibleProducts((prev) => Math.min(prev + 12, displayProducts.length));
        }
    };

    const handleScroll = () => {
        const scrollableDiv = scrollableRef.current;
        if (scrollableDiv) {
            const { scrollTop, scrollHeight, clientHeight } = scrollableDiv;
            if (scrollTop + clientHeight >= scrollHeight - 200 && visibleProducts < displayProducts.length) {
                loadMoreProducts();
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#f0f0f0]">
            <div className="flex justify-between bg-[#2c2c2c] text-white p-1 pl-2 pr-2">
                <div className="flex items-center space-x-2">
                    <span className="text-sm">Invoice</span>
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-52 bg-white border-r border-gray-300">
                    <div className="bg-[#e1e1e1] text-black p-2 border-b border-gray-300">
                        <h2 className="text-sm font-semibold">Categories</h2>
                    </div>
                    <div>
                        {Categories.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedCategory(item);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    setVisibleProducts(12);
                                }}
                                className={`p-2 text-xs cursor-pointer ${selectedCategory === item
                                    ? 'bg-black text-white'
                                    : 'text-black hover:bg-gray-200'
                                    }`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="bg-white border-b p-2">
                        <input
                            ref={searchRef}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Search products..."
                            className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-[#0078d7]"
                        />
                        {searchResults.length > 0 && searchQuery.trim() !== '' && (
                            <div className="absolute w-1/2 z-10 bg-white border shadow-lg max-h-48 overflow-y-auto text-xs">
                                {searchResults.map((product, index) => (
                                    <div
                                        key={product.id}
                                        ref={(el) => searchResultsRef.current[index] = el}
                                        className={`p-2 cursor-pointer hover:bg-gray-100 ${index === selectedSearchIndex ? 'bg-[#e6f2ff]' : ''}`}
                                        onClick={() => handleProductSelection(product)}
                                    >
                                        {product.name} - {product.category}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div
                        className="flex-1 overflow-auto p-2"
                        ref={scrollableRef}
                        onScroll={handleScroll}
                    >
                        <div className="grid grid-cols-4 gap-2">
                            {displayProducts.slice(0, visibleProducts).map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white border rounded overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleProductSelection(product)}
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-2">
                                        <h3 className="text-xs font-semibold truncate">{product.name}</h3>
                                        <div className="flex justify-between text-xs">
                                            <span>₹ {product.price}</span>
                                            {product.discount > 0 && (
                                                <span className="text-red-500">
                                                    {product.discount}% off
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-96 border-l">
                    <Cart product={selectedProduct} />
                </div>
            </div>
        </div>
    );
};

export default EntryComp;