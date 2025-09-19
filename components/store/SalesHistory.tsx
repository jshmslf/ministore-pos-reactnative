import API from "@/services/api";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

interface SaleItem {
    product: { name: string };
    quantity: number;
    price: number;
}

interface Sale {
    _id: string;
    customerName: string;
    items: SaleItem[];
    total: number;
    createdAt: string;
}

export default function SalesHistory() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/sales");
            setSales(data);
        } catch (err) {
            console.error("Error fetching sales:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return (
        <View className="flex-1 bg-background p-4">
            <Text className="text-xl font-bold text-white mb-4">🧾 Sales History</Text>

            <FlatList
                data={sales}
                keyExtractor={(item) => item._id}
                refreshing={loading}
                onRefresh={fetchSales}
                renderItem={({ item }) => {
                    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    });

                    return (
                        <View className="bg-neutral-900 p-3 mb-3 rounded-lg">
                            <Text className="text-white font-semibold">
                                {item.customerName}
                            </Text>
                            <Text className="text-neutral-400 text-sm mb-2">{date}</Text>

                            {item.items.map((i, idx) => (
                                <Text key={idx} className="text-neutral-300 text-sm">
                                    {i.product?.name} × {i.quantity} — ₱
                                    {(i.quantity * i.price).toFixed(2)}
                                </Text>
                            ))}

                            <Text className="text-green-400 font-bold mt-2">
                                Total: ₱{item.total.toFixed(2)}
                            </Text>
                        </View>
                    );
                }}
            />
        </View>
    );
}
