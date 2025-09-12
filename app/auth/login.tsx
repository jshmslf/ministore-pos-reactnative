import { Input } from "@/components/ui/input";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function LoginPage() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="light" />
            <View className="flex-1 justify-end px-6">
                <Text className="text-3xl font-bold text-center mb-8 text-accent">Login</Text>

                <Input
                    placeholder="Email"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    className="mb-4"
                />

                <Input
                    placeholder="Password"
                    autoComplete="password"
                    textContentType="password"
                    secureTextEntry
                    className="mb-4"
                />

                <Pressable className="bg-accent py-3 rounded-lg">
                    <Text className="text-white text-center font-semibold text-lg">
                        Log In
                    </Text>
                </Pressable>

                <Link href="/auth/register" replace className="mt-6 text-center text-accent mb-10">
                    Don’t have an account? <Text className="font-semibold">Sign Up here</Text>
                </Link>
            </View>
        </SafeAreaView>
    );
}
