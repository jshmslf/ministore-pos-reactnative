import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
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

interface Props {
    visible: boolean;
    products: Product[];
    onClose: () => void;
    onAdd: (product: Product, quantity: number) => void;
}

export default function ProductPicker({
    visible,
    products,
    onClose,
    onAdd,
}: Props) {
    const [quantity, setQuantity] = useState("1");
    const [selected, setSelected] = useState<Product | null>(null);

    const handleAdd = () => {
        if (selected && Number(quantity) > 0) {
            onAdd(selected, Number(quantity));
            setSelected(null);
            setQuantity("1");
            onClose();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-center items-center bg-black/60">
                <View className="bg-white w-80 p-6 rounded-lg max-h-[80%]">
                    <Text className="text-lg font-bold mb-4">Select Product</Text>

                    <ScrollView className="mb-4">
                        {products.map((p) => (
                            <Pressable
                                key={p._id}
                                onPress={() => setSelected(p)}
                                className={`p-2 mb-2 rounded ${selected?._id === p._id ? "bg-blue-500" : "bg-neutral-200"
                                    }`}
                            >
                                <Text
                                    className={`${selected?._id === p._id ? "text-white" : "text-black"
                                        }`}
                                >
                                    {p.name} (₱{p.sellingPrice}) | Stock: {p.stock}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {selected && (
                        <View className="mb-4">
                            <Text className="mb-1">Quantity</Text>
                            <TextInput
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                                className="border rounded p-2"
                            />
                        </View>
                    )}

                    <View className="flex-row justify-end gap-2">
                        <Pressable
                            onPress={onClose}
                            className="bg-gray-400 px-4 py-2 rounded"
                        >
                            <Text className="text-white">Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleAdd}
                            className="bg-green-600 px-4 py-2 rounded"
                            disabled={!selected}
                        >
                            <Text className="text-white">Add</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
