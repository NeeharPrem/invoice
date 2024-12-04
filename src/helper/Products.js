const products = [
        {
            "id": 1,
            "name": "Stylish Backpack",
            "image": "https://via.placeholder.com/300x200",
            "price": 1200,
            "category": "Bags",
            "discount": 10
        },
        {
            "id": 2,
            "name": "Laptop Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 1500,
            "category": "Bags",
            "discount": 0
        },
        {
            "id": 3,
            "name": "Travel Duffel Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 2200,
            "category": "Bags",
            "discount": 5
        },
        {
            "id": 4,
            "name": "Tote Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 899,
            "category": "Bags",
            "discount": 0
        },
        {
            "id": 5,
            "name": "Backpack with USB Port",
            "image": "https://via.placeholder.com/300x200",
            "price": 2400,
            "category": "Bags",
            "discount": 15
        },
        {
            "id": 6,
            "name": "Canvas Tote Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 799,
            "category": "Bags",
            "discount": 7
        },
        {
            "id": 7,
            "name": "Gym Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 1800,
            "category": "Bags",
            "discount": 0
        },
        {
            "id": 8,
            "name": "Leather Messenger Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 3200,
            "category": "Bags",
            "discount": 10
        },
        {
            "id": 9,
            "name": "Laptop Sleeve",
            "image": "https://via.placeholder.com/300x200",
            "price": 799,
            "category": "Bags",
            "discount": 0
        },
        {
            "id": 10,
            "name": "Weekend Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 2800,
            "category": "Bags",
            "discount": 20
        },
        {
            "id": 11,
            "name": "Crossbody Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 1299,
            "category": "Bags",
            "discount": 5
        },
        {
            "id": 12,
            "name": "School Backpack",
            "image": "https://via.placeholder.com/300x200",
            "price": 1000,
            "category": "Bags",
            "discount": 0
        },
        {
            "id": 13,
            "name": "Hiking Backpack",
            "image": "https://via.placeholder.com/300x200",
            "price": 3500,
            "category": "Bags",
            "discount": 10
        },
        {
            "id": 14,
            "name": "Duffel Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 1500,
            "category": "Bags",
            "discount": 5
        },
        {
            "id": 15,
            "name": "Diaper Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 999,
            "category": "Bags",
            "discount": 12
        },
        {
            "id": 16,
            "name": "Laptop Backpack",
            "image": "https://via.placeholder.com/300x200",
            "price": 2200,
            "category": "Bags",
            "discount": 0
        },
        {
            "id": 17,
            "name": "Briefcase",
            "image": "https://via.placeholder.com/300x200",
            "price": 2999,
            "category": "Bags",
            "discount": 10
        },
        {
            "id": 18,
            "name": "Handbag",
            "image": "https://via.placeholder.com/300x200",
            "price": 1599,
            "category": "Bags",
            "discount": 0
        },
        {
            "id": 19,
            "name": "Messenger Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 2499,
            "category": "Bags",
            "discount": 15
        },
        {
            "id": 20,
            "name": "Weekend Travel Bag",
            "image": "https://via.placeholder.com/300x200",
            "price": 2999,
            "category": "Bags",
            "discount": 0
        },
        {
            "id": 21,
            "name": "Running Shoes",
            "image": "https://via.placeholder.com/300x200",
            "price": 2500,
            "category": "Footwear",
            "discount": 10
        },
        {
            "id": 22,
            "name": "Sneakers",
            "image": "https://via.placeholder.com/300x200",
            "price": 1800,
            "category": "Footwear",
            "discount": 0
        },
        {
            "id": 23,
            "name": "Formal Shoes",
            "image": "https://via.placeholder.com/300x200",
            "price": 3000,
            "category": "Footwear",
            "discount": 15
        },
        {
            "id": 24,
            "name": "Slippers",
            "image": "https://via.placeholder.com/300x200",
            "price": 399,
            "category": "Footwear",
            "discount": 5
        },
        {
            "id": 25,
            "name": "Flip Flops",
            "image": "https://via.placeholder.com/300x200",
            "price": 499,
            "category": "Footwear",
            "discount": 20
        },
        {
            "id": 26,
            "name": "Boots",
            "image": "https://via.placeholder.com/300x200",
            "price": 3500,
            "category": "Footwear",
            "discount": 0
        },
        {
            "id": 27,
            "name": "High Heels",
            "image": "https://via.placeholder.com/300x200",
            "price": 2200,
            "category": "Footwear",
            "discount": 25
        },
        {
            "id": 28,
            "name": "Sandals",
            "image": "https://via.placeholder.com/300x200",
            "price": 999,
            "category": "Footwear",
            "discount": 30
        },
        {
            "id": 29,
            "name": "Sports Shoes",
            "image": "https://via.placeholder.com/300x200",
            "price": 2200,
            "category": "Footwear",
            "discount": 10
        },
        {
            "id": 30,
            "name": "Clogs",
            "image": "https://via.placeholder.com/300x200",
            "price": 1500,
            "category": "Footwear",
            "discount": 0
        },
        {
            "id": 31,
            "name": "Canvas Shoes",
            "image": "https://via.placeholder.com/300x200",
            "price": 1200,
            "category": "Footwear",
            "discount": 5
        },
        {
            "id": 32,
            "name": "Rain Boots",
            "image": "https://via.placeholder.com/300x200",
            "price": 1300,
            "category": "Footwear",
            "discount": 20
        },
        {
            "id": 33,
            "name": "Outdoor Sandals",
            "image": "https://via.placeholder.com/300x200",
            "price": 800,
            "category": "Footwear",
            "discount": 15
        },
        {
            "id": 34,
            "name": "Socks",
            "image": "https://via.placeholder.com/300x200",
            "price": 200,
            "category": "Footwear",
            "discount": 0
        },
        {
            "id": 35,
            "name": "Trail Running Shoes",
            "image": "https://via.placeholder.com/300x200",
            "price": 3000,
            "category": "Footwear",
            "discount": 10
        },
        {
            "id": 36,
            "name": "Leather Boots",
            "image": "https://via.placeholder.com/300x200",
            "price": 4000,
            "category": "Footwear",
            "discount": 25
        },
        {
            "id": 37,
            "name": "Moccasins",
            "image": "https://via.placeholder.com/300x200",
            "price": 1800,
            "category": "Footwear",
            "discount": 0
        },
        {
            "id": 38,
            "name": "Dress Shoes",
            "image": "https://via.placeholder.com/300x200",
            "price": 3500,
            "category": "Footwear",
            "discount": 10
        },
        {
            "id": 39,
            "name": "Leather Wallet",
            "image": "https://via.placeholder.com/300x200",
            "price": 899,
            "category": "Accessories",
            "discount": 5
        },
        {
            "id": 40,
            "name": "Sports Watch",
            "image": "https://via.placeholder.com/300x200",
            "price": 3500,
            "category": "Accessories",
            "discount": 0
        },
        {
            "id": 41,
            "name": "Smartphone Case",
            "image": "https://via.placeholder.com/300x200",
            "price": 299,
            "category": "Accessories",
            "discount": 10
        },
    {
        "id": 42,
        "name": "Sunglasses",
        "image": "https://via.placeholder.com/300x200",
        "price": 1300,
        "category": "Accessories",
        "discount": 0
    },
    {
        "id": 43,
        "name": "Leather Belt",
        "image": "https://via.placeholder.com/300x200",
        "price": 450,
        "category": "Accessories",
        "discount": 5
    },
    {
        "id": 44,
        "name": "Portable Charger",
        "image": "https://via.placeholder.com/300x200",
        "price": 1299,
        "category": "Accessories",
        "discount": 0
    },
    {
        "id": 45,
        "name": "Bluetooth Headphones",
        "image": "https://via.placeholder.com/300x200",
        "price": 1999,
        "category": "Accessories",
        "discount": 10
    },
    {
        "id": 46,
        "name": "Smartwatch",
        "image": "https://via.placeholder.com/300x200",
        "price": 2499,
        "category": "Accessories",
        "discount": 0
    },
    {
        "id": 47,
        "name": "Hat",
        "image": "https://via.placeholder.com/300x200",
        "price": 799,
        "category": "Accessories",
        "discount": 15
    },
    {
        "id": 48,
        "name": "Scarf",
        "image": "https://via.placeholder.com/300x200",
        "price": 499,
        "category": "Accessories",
        "discount": 0
    },
    {
        "id": 49,
        "name": "Bag Pack",
        "image": "https://via.placeholder.com/300x200",
        "price": 2000,
        "category": "Accessories",
        "discount": 20
    },
    {
        "id": 50,
        "name": "Bracelet",
        "image": "https://via.placeholder.com/300x200",
        "price": 600,
        "category": "Accessories",
        "discount": 0
    },
    {
        "id": 51,
        "name": "Keychain",
        "image": "https://via.placeholder.com/300x200",
        "price": 150,
        "category": "Accessories",
        "discount": 5
    },
    {
        "id": 52,
        "name": "Wallet with Cardholder",
        "image": "https://via.placeholder.com/300x200",
        "price": 850,
        "category": "Accessories",
        "discount": 10
    },
    {
        "id": 53,
        "name": "Phone Stand",
        "image": "https://via.placeholder.com/300x200",
        "price": 299,
        "category": "Accessories",
        "discount": 0
    },
    {
        "id": 54,
        "name": "Ring",
        "image": "https://via.placeholder.com/300x200",
        "price": 999,
        "category": "Accessories",
        "discount": 15
    },
    {
        "id": 55,
        "name": "Earrings",
        "image": "https://via.placeholder.com/300x200",
        "price": 799,
        "category": "Accessories",
        "discount": 0
    },
    {
        "id": 56,
        "name": "Tie",
        "image": "https://via.placeholder.com/300x200",
        "price": 600,
        "category": "Accessories",
        "discount": 10
    },
    {
        "id": 57,
        "name": "Smartphone",
        "image": "https://via.placeholder.com/300x200",
        "price": 19999,
        "category": "Electronics",
        "discount": 0
    },
    {
        "id": 58,
        "name": "Wireless Earbuds",
        "image": "https://via.placeholder.com/300x200",
        "price": 2999,
        "category": "Electronics",
        "discount": 5
    },
    {
        "id": 59,
        "name": "Laptop",
        "image": "https://via.placeholder.com/300x200",
        "price": 54999,
        "category": "Electronics",
        "discount": 0
    },
    {
        "id": 60,
        "name": "Smart TV",
        "image": "https://via.placeholder.com/300x200",
        "price": 24999,
        "category": "Electronics",
        "discount": 10
    },
    {
        "id": 61,
        "name": "Bluetooth Speaker",
        "image": "https://via.placeholder.com/300x200",
        "price": 1499,
        "category": "Electronics",
        "discount": 0
    },
    {
        "id": 62,
        "name": "Smart Watch",
        "image": "https://via.placeholder.com/300x200",
        "price": 3499,
        "category": "Electronics",
        "discount": 20
    },
    {
        "id": 63,
        "name": "Gaming Console",
        "image": "https://via.placeholder.com/300x200",
        "price": 39999,
        "category": "Electronics",
        "discount": 0
    },
    {
        "id": 64,
        "name": "Cotton T-Shirt",
        "image": "https://via.placeholder.com/300x200",
        "price": 499,
        "category": "Cloths",
        "discount": 10
    },
    {
        "id": 65,
        "name": "Jeans",
        "image": "https://via.placeholder.com/300x200",
        "price": 1499,
        "category": "Cloths",
        "discount": 5
    },
    {
        "id": 66,
        "name": "Formal Shirt",
        "image": "https://via.placeholder.com/300x200",
        "price": 899,
        "category": "Cloths",
        "discount": 0
    },
    {
        "id": 67,
        "name": "Sweater",
        "image": "https://via.placeholder.com/300x200",
        "price": 1199,
        "category": "Cloths",
        "discount": 15
    },
    {
        "id": 68,
        "name": "Jacket",
        "image": "https://via.placeholder.com/300x200",
        "price": 2499,
        "category": "Cloths",
        "discount": 8
    },
    {
        "id": 69,
        "name": "Casual Shoes",
        "image": "https://via.placeholder.com/300x200",
        "price": 1200,
        "category": "Cloths",
        "discount": 0
    },
    {
        "id": 70,
        "name": "Dress",
        "image": "https://via.placeholder.com/300x200",
        "price": 1999,
        "category": "Cloths",
        "discount": 20
    },
    {
        "id": 71,
        "name": "Shorts",
        "image": "https://via.placeholder.com/300x200",
        "price": 799,
        "category": "Cloths",
        "discount": 5
    },
    {
        "id": 72,
        "name": "Tracksuit",
        "image": "https://via.placeholder.com/300x200",
        "price": 1799,
        "category": "Cloths",
        "discount": 12
    },
    {
        "id": 73,
        "name": "Blazer",
        "image": "https://via.placeholder.com/300x200",
        "price": 3999,
        "category": "Cloths",
        "discount": 7
    }
];

export default products;