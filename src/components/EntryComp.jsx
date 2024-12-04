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
        <div className="flex h-screen w-full">
            <div className="w-64 bg-gray-50 p-6">
                <h5 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
                    Categories
                </h5>
                {Categories.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setSelectedCategory(item);
                            setSearchQuery('');
                            setSearchResults([]);
                            setVisibleProducts(12);
                        }}
                        className={`py-2 px-3 hover:bg-gray-100 rounded cursor-pointer transition duration-300 ${selectedCategory === item
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-black hover:text-blue-600'
                            }`}
                    >
                        {item}
                    </div>
                ))}
            </div>
            <div className="flex-grow flex flex-col">
                <div className="p-4 bg-white border-b relative">
                    <input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search products..."
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchResults.length > 0 && searchQuery.trim() !== '' && (
                        <div className="absolute z-10 w-full left-0 top-full hover:shadow-md bg-white border shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((product, index) => (
                                <div
                                    key={product.id}
                                    ref={(el) => searchResultsRef.current[index] = el}
                                    className={`p-2 cursor-pointer hover:shadow-md hover:bg-gray-100 ${index === selectedSearchIndex ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleProductSelection(product)}
                                >
                                    {product.name} - {product.category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div
                    className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
                    ref={scrollableRef}
                    onScroll={handleScroll}
                    style={{
                        pointerEvents: 'auto',
                    }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayProducts.slice(0, visibleProducts).map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                                onClick={() => handleProductSelection(product)}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-base font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">₹ {product.price}</p>
                                    {product.discount > 0 && (
                                        <p className="text-sm text-gray-500 mt-1"><span>Discount : </span>{product.discount} %</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-[45rem] border-l">
                <Cart product={selectedProduct} />
            </div>
        </div>
    );
};

export default EntryComp;