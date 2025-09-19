import API from "@/services/api";
import React, { useEffect, useState } from "react";
import { RefreshControl, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Sale {
    _id: string;
    customerName: string;
    total: number;
    createdAt: string;
}

interface Section {
    title: string;
    data: Sale[];
}

export default function SalesHistoryPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSales = async () => {
        try {
            const { data } = await API.get("/sales");
            setSales(data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    const groupByDate = (sales: Sale[]): Section[] => {
        const grouped: { [key: string]: Sale[] } = {};

        sales.forEach((sale) => {
            const dateKey = new Date(sale.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(sale);
        });

        return Object.keys(grouped).map((date) => ({
            title: date,
            data: grouped[date],
        }));
    };

    useEffect(() => {
        const init = async () => {
            await fetchSales();
        };
        init();
    }, []);

    useEffect(() => {
        setSections(groupByDate(sales));
    }, [sales]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSales();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-4">
            <Text className="text-2xl font-bold text-accent mb-4">🧾 Sales History</Text>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item._id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderSectionHeader={({ section: { title } }) => (
                    <Text className="text-white text-lg font-bold mt-4 mb-2">{title}</Text>
                )}
                renderItem={({ item }) => (
                    <View className="bg-neutral-900 p-3 rounded-lg mb-2">
                        <Text className="text-white font-bold">{item.customerName}</Text>
                        <Text className="text-neutral-400">
                            Total: ₱{item.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </Text>
                        <Text className="text-neutral-400 text-sm">
                            {new Date(item.createdAt).toLocaleTimeString()}
                        </Text>
                    </View>
                )}
                stickySectionHeadersEnabled
            />
        </SafeAreaView>
    );
}
