import API from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

interface User {
    firstName: string;
    middleName?: string;
    lastName: string;
    birthday?: string;
    address?: string;
    email: string;
    storeName: string;
    createdAt: string;
}

export default function ProfileTab() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const { data } = await API.get("/auth/me");
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/auth/login");
    };

    const handleEditProfile = () => {
        router.push("/profile/edit");
    };

    const handleSalesHistory = () => {
        router.push("/profile/sales-history");
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchUser();
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <Text className="text-white">Failed to load profile.</Text>
            </View>
        );
    }

    const birthdate = user.birthday
        ? new Date(user.birthday).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        : null;

    const joindate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        : null;

    return (
        <ScrollView
            className="flex-1 bg-background p-6"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text className="text-2xl font-bold text-accent mb-4">
                Hello, {user.firstName}!
            </Text>

            {/* User Info */}
            <View className="mb-6 space-y-1">
                <Text className="text-white">
                    Name: {user.firstName} {user.lastName}
                </Text>
                <Text className="text-white">Email: {user.email}</Text>
                {birthdate && <Text className="text-white">Birthday: {birthdate}</Text>}
                {user.address && <Text className="text-white">Address: {user.address}</Text>}
                <Text className="text-white">Store: {user.storeName}</Text>
                {joindate && <Text className="text-white">Joined: {joindate}</Text>}
            </View>

            {/* Actions: Edit & Logout with gap */}
            <View className="mb-6">
                <Pressable
                    className="bg-accent px-4 py-2 rounded-lg mb-3 items-center"
                    onPress={handleEditProfile}
                >
                    <Text className="text-white font-bold">Edit Profile</Text>
                </Pressable>

                <Pressable
                    className="bg-red-600 px-4 py-2 rounded-lg items-center"
                    onPress={handleLogout}
                >
                    <Text className="text-white font-bold">Logout</Text>
                </Pressable>
            </View>

            {/* Sales History Button */}
            <Pressable
                className="bg-neutral-900 px-4 py-3 rounded-lg"
                onPress={handleSalesHistory}
            >
                <Text className="text-white font-bold text-center text-lg">
                    Sales History
                </Text>
            </Pressable>
        </ScrollView>
    );
}
