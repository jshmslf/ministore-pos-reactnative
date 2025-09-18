// app/tabs/DashboardTab.tsx
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
    const [refreshing, setRefreshing] = useState(false);

    // current date
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    // fetch product count
    const fetchProductCount = async () => {
        try {
            const { data } = await API.get("/products");
            setProductCount(data.length); // count products, not stock
        } catch (err) {
            console.error("Error fetching product count:", err);
        }
    };

    useEffect(() => {
        fetchProductCount();
    }, []);

    // handle refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProductCount();
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
            <Text className="text-neutral-400 mb-6">{today}</Text>

            {/* Stats */}
            <View className="flex-row justify-between">
                <DashboardStats label="Products" value={productCount} />
                <DashboardStats label="Sales Today" value={0} />
            </View>
        </ScrollView>
    );
}
