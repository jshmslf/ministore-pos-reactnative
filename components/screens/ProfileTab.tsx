import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface Props {
    firstName?: string;
}

export default function ProfileTab({ firstName }: Props) {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-xl text-neutral-50">👤 {firstName}&apos;s Profile</Text>

            <Pressable
                onPress={async () => {
                    await AsyncStorage.removeItem("token");
                    router.replace("/auth/login");
                }}
                className="bg-red-500 px-6 py-3 rounded-xl mt-4"
            >
                <Text className="text-white font-semibold text-lg">Logout</Text>
            </Pressable>
        </View>
    );
}
