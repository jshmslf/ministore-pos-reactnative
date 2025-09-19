import React from "react";
import { Text, View } from "react-native";

interface Props {
    label: string;
    value: number | string;
    currency?: boolean;
}

export default function DashboardStats({ label, value, currency }: Props) {
    const formattedValue = currency
        ? `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : value;
    return (
        <View className="bg-neutral-900 rounded-xl p-4 w-[150px] items-center shadow-md">
            <Text className="text-xl font-bold text-accent">{formattedValue}</Text>
            <Text className="text-neutral-400 text-sm mt-1">{label}</Text>
        </View>
    );
}
