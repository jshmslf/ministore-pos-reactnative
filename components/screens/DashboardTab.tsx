import DashboardStats from "@/components/dashboard/DashboardStats";
import API from "@/services/api";
import React, { useEffect, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

interface Props {
    firstName?: string;
}

export default function DashboardTab({ firstName }: Props) {
    const [productCount, setProductCount] = useState(0);
    const [salesToday, setSalesToday] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    // current date
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // fetch product count
    const fetchProductCount = async () => {
        try {
            const { data } = await API.get("/products");
            setProductCount(data.length); // count products, not stock
        } catch (err) {
            console.error("Error fetching product count:", err);
        }
    };

    // fetch sales today
    const fetchSalesToday = async () => {
        try {
            const { data } = await API.get("/sales/today");
            setSalesToday(data.totalToday);
        } catch (err) {
            console.error("Error fetching sales today:", err);
        }
    };

    useEffect(() => {
        fetchProductCount();
        fetchSalesToday();
    }, []);

    // handle refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchProductCount(), fetchSalesToday()]);
        setRefreshing(false);
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{ padding: 24 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Greeting */}
            <Text className="text-2xl font-bold text-accent mb-2">
                Welcome {firstName || "User"} 👋
            </Text>
            <Text className="text-neutral-400 mb-6">
                {today.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })}
            </Text>

            {/* Stats */}
            <View className="flex-row justify-between">
                <DashboardStats label="Products" value={productCount} />
                <DashboardStats label="Sales Today" value={salesToday} currency />
            </View>
        </ScrollView>
    );
}
