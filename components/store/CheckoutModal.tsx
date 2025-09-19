import React, { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

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

interface Props {
    visible: boolean;
    cart: CartItem[];
    onClose: () => void;
    onConfirm: (customerName: string) => void;
}

export default function CheckoutModal({
    visible,
    cart,
    onClose,
    onConfirm,
}: Props) {
    const [customerName, setCustomerName] = useState("Customer");

    // Reset customer name when modal closes
    useEffect(() => {
        if (!visible) {
            setCustomerName("Customer");
        }
    }, [visible]);

    const total = cart.reduce(
        (sum, item) => sum + item.quantity * item.product.sellingPrice,
        0
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/50 justify-center p-4">
                <View className="bg-neutral-900 rounded-2xl p-4">
                    <Text className="text-lg font-bold text-white mb-2">🧾 Checkout</Text>

                    {/* Customer name input */}
                    <TextInput
                        value={customerName}
                        onChangeText={setCustomerName}
                        placeholder="Enter customer name"
                        placeholderTextColor="#999"
                        className="bg-neutral-800 text-white px-3 py-2 rounded-lg mb-4"
                    />

                    {/* Item list */}
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.product._id}
                        renderItem={({ item }) => (
                            <Text className="text-neutral-300 mb-1">
                                {item.product.name} × {item.quantity} — ₱
                                {(item.quantity * item.product.sellingPrice).toFixed(2)}
                            </Text>
                        )}
                    />

                    {/* Total */}
                    <Text className="text-green-400 font-bold mt-3">
                        Total: ₱{total.toFixed(2)}
                    </Text>

                    {/* Actions */}
                    <View className="flex-row justify-end mt-4 space-x-3">
                        <Pressable
                            onPress={onClose}
                            className="px-4 py-2 bg-neutral-700 rounded-lg"
                        >
                            <Text className="text-white">Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => onConfirm(customerName.trim() || "Customer")}
                            disabled={cart.length === 0}
                            className={`px-4 py-2 rounded-lg ${cart.length === 0 ? "bg-gray-600" : "bg-accent"
                                }`}
                        >
                            <Text className="text-white font-bold">Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
