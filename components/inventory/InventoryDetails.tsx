import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface Product {
    _id: string;
    name: string;
    category?: string;
    srp: number;
    sellingPrice: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    visible: boolean;
    product: Product | null;
    onClose: () => void;
}

export default function InventoryDetails({ visible, product, onClose }: Props) {
    if (!product) return null;

    const createdDate = new Date(product.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    const updatedDate = new Date(product.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-neutral-700 w-80 p-6 rounded-lg">
                    <Text className="text-xl font-bold mb-4 text-white">{product.name}</Text>

                    <Text className="mb-1 text-white">📂 Category: {product.category || "N/A"}</Text>
                    <Text className="mb-1 text-white">📦 Stock: {product.stock}</Text>
                    <Text className="mb-1 text-white">💰 SRP: ₱{product.srp}</Text>
                    <Text className="mb-1 text-white">🏷️ My Price: ₱{product.sellingPrice}</Text>
                    <Text className="text-xs text-gray-500 mt-2 text-white">Added: {createdDate}</Text>
                    <Text className="text-xs text-gray-500 text-white">Updated: {updatedDate}</Text>

                    <View className="flex-row justify-end mt-4">
                        <Pressable onPress={onClose} className="bg-blue-500 px-4 py-2 rounded">
                            <Text className="text-white">Close</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
