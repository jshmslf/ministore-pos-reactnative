import { Picker } from "@react-native-picker/picker";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

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
    products: Product[];
    loading: boolean;
    onRefresh: () => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onPress: (product: Product) => void;
}

export default function InventoryList({
    products,
    loading,
    onRefresh,
    onEdit,
    onDelete,
    onPress,
}: Props) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // 🔎 Filter + Search logic
    const filteredProducts = useMemo(() => {
        let list = [...products];

        // Filter
        if (filter !== "all") {
            if (filter === "alpha") {
                list.sort((a, b) => a.name.localeCompare(b.name));
            } else {
                list = list.filter((p) => p.category === filter);
            }
        }

        // Search
        if (search.trim() !== "") {
            list = list.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        return list;
    }, [products, filter, search]);

    return (
        <View className="flex-1">
            {/* 🔍 Search input */}
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search products..."
                className="bg-neutral-800 text-white px-3 py-2 mb-2 rounded"
                placeholderTextColor="#999"
            />

            {/* 🧾 Filter Dropdown */}
            <View className="bg-neutral-800 rounded mb-2 px-1 h-9 justify-center">
                <Picker
                    selectedValue={filter}
                    onValueChange={(value) => setFilter(value)}
                    dropdownIconColor="#fff"
                    style={{ color: "white" }}
                >
                    <Picker.Item label="All" value="all" />
                    <Picker.Item label="Alphabetical" value="alpha" />
                    <Picker.Item label="Snacks" value="Snacks" />
                    <Picker.Item label="School Supplies" value="School Supplies" />
                    <Picker.Item label="Soap" value="Soap" />
                    <Picker.Item label="Shampoo" value="Shampoo" />
                    <Picker.Item label="Conditioner" value="Conditioner" />
                    <Picker.Item label="Others" value="Others" />
                </Picker>
            </View>

            {/* 📋 Product List */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item._id}
                refreshing={loading}
                onRefresh={onRefresh}
                renderItem={({ item }) => {
                    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    });

                    return (
                        <Pressable
                            onPress={() => onPress(item)}
                            className="flex-row justify-between items-center bg-neutral-900 p-3 mb-2 rounded-lg"
                        >
                            <View>
                                <Text className="text-white font-semibold">{item.name}</Text>
                                <Text className="text-neutral-400 text-sm">
                                    {item.category || "No category"} | Stock: {item.stock}
                                </Text>
                                <Text className="text-neutral-400 text-sm">
                                    SRP: ₱{item.srp} | My Price: ₱{item.sellingPrice}
                                </Text>
                                <Text className="text-neutral-500 text-xs">Added: {date}</Text>
                            </View>

                            <View className="flex-row gap-2">
                                <Pressable
                                    onPress={() => onEdit(item)}
                                    className="bg-blue-500 px-3 py-1 rounded"
                                >
                                    <Text className="text-white">Edit</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => onDelete(item._id)}
                                    className="bg-red-500 px-3 py-1 rounded"
                                >
                                    <Text className="text-white">Delete</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}
