// components/dashboard/DashboardStats.tsx
import React from "react";
import { Text, View } from "react-native";

interface Props {
    label: string;
    value: number | string;
}

export default function DashboardStats({ label, value }: Props) {
    return (
        <View className="bg-neutral-900 rounded-xl p-4 w-[150px] items-center shadow-md">
            <Text className="text-2xl font-bold text-accent">{value}</Text>
            <Text className="text-neutral-400 text-sm mt-1">{label}</Text>
        </View>
    );
}
