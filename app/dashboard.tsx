import API from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DashboardTab from "@/components/screens/DashboardTab";
import InventoryTab from "@/components/screens/InventoryTab";
import ProfileTab from "@/components/screens/ProfileTab";
import StoreTab from "@/components/screens/StoreTab";
import { StatusBar } from "expo-status-bar";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<
        "dashboard" | "inventory" | "store" | "profile"
    >("dashboard");

    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    router.replace("/auth/login");
                    return;
                }

                const { data } = await API.get("/auth/me");
                setUser(data);
            } catch (error: any) {
                console.error(error);
                router.replace("/auth/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    const renderScreen = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardTab firstName={user?.firstName} />;
            case "inventory":
                return <InventoryTab />;
            case "store":
                return <StoreTab />;
            case "profile":
                return <ProfileTab />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="light" />

            {/* Main Content */}
            <View className="flex-1">{renderScreen()}</View>

            {/* Bottom Navbar */}
            <View className="flex-row justify-around bg-neutral-900 py-3 border-t border-neutral-700">
                {["dashboard", "inventory", "store", "profile"].map((tab) => (
                    <Pressable key={tab} onPress={() => setActiveTab(tab as any)}>
                        <Text
                            className={`text-sm ${activeTab === tab
                                ? "text-accent font-bold"
                                : "text-neutral-400"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </SafeAreaView>
    );
}
