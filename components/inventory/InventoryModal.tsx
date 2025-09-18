import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

interface Product {
    _id: string;
    name: string;
    category?: string;
    srp: number;
    sellingPrice: number;
    stock: number;
}

interface Props {
    visible: boolean;
    product: Product | null;
    onClose: () => void;
    onSave: (values: {
        name: string;
        category: string;
        srp: number;
        sellingPrice: number;
        stock: number;
    }) => void;
}

export default function InventoryModal({ visible, product, onClose, onSave }: Props) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [srp, setSrp] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        if (product) {
            setName(product.name);
            setCategory(product.category || "");
            setSrp(product.srp.toString());
            setSellingPrice(product.sellingPrice.toString());
            setStock(product.stock.toString());
        } else {
            setName("");
            setCategory("");
            setSrp("");
            setSellingPrice("");
            setStock("");
        }
    }, [product]);

    const handleSave = () => {
        onSave({
            name,
            category,
            srp: Number(srp),
            sellingPrice: Number(sellingPrice),
            stock: Number(stock),
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-neutral-800 w-80 p-6 rounded-lg">
                    <Text className="text-xl font-bold mb-4 text-neutral-50">
                        {product ? "Edit Product" : "Add Product"}
                    </Text>

                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                        className="border p-2 mb-2 rounded border-neutral-50 bg-neutral-700 text-white"
                        placeholderTextColor={`gray`}
                    />
                    <TextInput
                        value={srp}
                        onChangeText={setSrp}
                        placeholder="SRP"
                        keyboardType="numeric"
                        className="border p-2 mb-2 rounded border-neutral-50 bg-neutral-700 text-white"
                        placeholderTextColor={`gray`}
                    />
                    <TextInput
                        value={sellingPrice}
                        onChangeText={setSellingPrice}
                        placeholder="Selling Price"
                        keyboardType="numeric"
                        className="border p-2 mb-2 rounded border-neutral-50 bg-neutral-700 text-white"
                        placeholderTextColor={`gray`}
                    />
                    <TextInput
                        value={stock}
                        onChangeText={setStock}
                        placeholder="Stock"
                        keyboardType="numeric"
                        className="border p-2 mb-2 rounded border-neutral-50 bg-neutral-700 text-white"
                        placeholderTextColor={`gray`}
                    />

                    {/* Category Dropdown */}
                    <View className="border mb-4 h-9 justify-center rounded border-neutral-50 bg-neutral-700 overflow-hidden">
                        <Picker
                            selectedValue={category}
                            onValueChange={(value) => setCategory(value)}
                            dropdownIconColor="#fafafa"
                            style={{ color: "white", backgroundColor: "#404040" }}
                        >
                            <Picker.Item label="Select category" value="" />
                            <Picker.Item label="Snacks" value="Snacks" />
                            <Picker.Item label="School Supplies" value="School Supplies" />
                            <Picker.Item label="Soap" value="Soap" />
                            <Picker.Item label="Shampoo" value="Shampoo" />
                            <Picker.Item label="Conditioner" value="Conditioner" />
                            <Picker.Item label="Others" value="Others" />
                        </Picker>
                    </View>

                    <View className="flex-row justify-end gap-2">
                        <Pressable onPress={onClose} className="bg-gray-400 px-4 py-2 rounded">
                            <Text className="text-white">Cancel</Text>
                        </Pressable>
                        <Pressable onPress={handleSave} className="bg-green-600 px-4 py-2 rounded">
                            <Text className="text-white">Save</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
