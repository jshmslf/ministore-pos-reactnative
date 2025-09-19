import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface Product {
    _id: string;
    name: string;
    sellingPrice: number;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface Props {
    cart: CartItem[];
    onRemove: (id: string) => void;
}

export default function CartList({ cart, onRemove }: Props) {
    if (cart.length === 0) {
        return (
            <Text className="text-neutral-400 text-center mt-6">
                No items in cart yet
            </Text>
        );
    }

    return (
        <FlatList
            data={cart}
            keyExtractor={(item) => item.product._id}
            renderItem={({ item }) => (
                <View className="flex-row justify-between items-center bg-neutral-800 p-3 mb-2 rounded-lg">
                    <View>
                        <Text className="text-white font-semibold">{item.product.name}</Text>
                        <Text className="text-neutral-400 text-sm">
                            Qty: {item.quantity} × ₱{item.product.sellingPrice}
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => onRemove(item.product._id)}
                        className="bg-red-500 px-3 py-1 rounded"
                    >
                        <Text className="text-white">Remove</Text>
                    </Pressable>
                </View>
            )}
        />
    );
}
