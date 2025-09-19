import API from "@/services/api";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import CartList from "@/components/store/CartList";
import CheckoutModal from "@/components/store/CheckoutModal";
import ProductPicker from "@/components/store/ProductPicker";

interface Product {
    _id: string;
    name: string;
    sellingPrice: number;
    stock: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function StoreTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerActive, setCustomerActive] = useState(false);

    const [pickerVisible, setPickerVisible] = useState(false);
    const [checkoutVisible, setCheckoutVisible] = useState(false);

    // Fetch products (only products with stock > 0)
    const fetchProducts = async () => {
        try {
            const { data } = await API.get("/products");
            setProducts(data.filter((p: Product) => p.stock > 0));
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add item to cart
    const handleAddToCart = (product: Product, quantity: number) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product._id === product._id);
            if (existing) {
                return prev.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
    };

    // Remove item from cart
    const handleRemove = (id: string) => {
        setCart((prev) => prev.filter((item) => item.product._id !== id));
    };

    // Cancel transaction
    const handleCancelTransaction = () => {
        setCart([]);
        setCustomerActive(false);
    };

    // Checkout
    const handleCheckout = async (customerName: string) => {
        try {
            if (cart.length === 0) return;

            await API.post("/sales", {
                customerName,
                items: cart.map((c) => ({
                    productId: c.product._id,
                    quantity: c.quantity,
                    price: c.product.sellingPrice,
                })),
            });

            // Reset state
            setCart([]);
            setCheckoutVisible(false);
            setCustomerActive(false);

            // Refresh products to reflect updated stock
            fetchProducts();
        } catch (err: any) {
            console.error("Checkout error:", err?.response?.data || err.message);
        }
    };

    // Compute total
    const total = cart.reduce(
        (sum, item) => sum + item.quantity * item.product.sellingPrice,
        0
    );

    return (
        <View className="flex-1 p-4 bg-background">
            {!customerActive ? (
                <View className="flex-1 justify-center items-center">
                    <Pressable
                        onPress={() => setCustomerActive(true)}
                        className="bg-accent px-6 py-3 rounded-full"
                    >
                        <Text className="text-white text-lg font-bold">➕ New Customer</Text>
                    </Pressable>
                </View>
            ) : (
                <View className="flex-1">
                    <Text className="text-xl font-bold text-white mb-4">
                        🛒 Current Transaction
                    </Text>

                    {/* Cart Items */}
                    <CartList cart={cart} onRemove={handleRemove} />

                    {/* Total */}
                    <View className="mt-4">
                        <Text className="text-white text-lg font-semibold">
                            Total: ₱{total.toFixed(2)}
                        </Text>
                    </View>

                    {/* Actions */}
                    <View className="flex-row justify-between mt-6">
                        <Pressable
                            onPress={() => setPickerVisible(true)}
                            className="bg-blue-500 px-4 py-2 rounded"
                        >
                            <Text className="text-white font-semibold">➕ Add Item</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleCancelTransaction}
                            className="bg-red-600 px-4 py-2 rounded"
                        >
                            <Text className="text-white font-semibold">✖ Cancel</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setCheckoutVisible(true)}
                            disabled={cart.length === 0}
                            className={`px-4 py-2 rounded ${cart.length === 0 ? "bg-gray-600" : "bg-green-600"
                                }`}
                        >
                            <Text className="text-white font-semibold">💳 Checkout</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* Product Picker */}
            <ProductPicker
                visible={pickerVisible}
                products={products}
                onClose={() => setPickerVisible(false)}
                onAdd={handleAddToCart}
            />

            {/* Checkout Modal */}
            <CheckoutModal
                visible={checkoutVisible}
                cart={cart}
                onClose={() => setCheckoutVisible(false)}
                onConfirm={handleCheckout}
            />
        </View>
    );
}
