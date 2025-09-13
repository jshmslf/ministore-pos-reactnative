import PasswordInput from "@/components/PasswordInput";
import { Input } from "@/components/ui/input";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleRegister = () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Password do no match!")
            return;
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="dark" />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS = push up, Android = resize height
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // offset for SafeArea / StatusBar
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", paddingHorizontal: 24 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className="text-3xl font-bold text-center mb-8 text-accent">Register</Text>

                    <Input placeholder="First Name" className="mb-4" />
                    <Input placeholder="Middle Name" className="mb-4" />
                    <Input placeholder="Last Name" className="mb-4" />
                    <Input
                        placeholder="Email"
                        autoComplete="email"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        className="mb-4"
                    />

                    {/* password */}

                    <PasswordInput placeholder="Password" value={password} onChangeText={setPassword} />
                    <PasswordInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} />

                    {/* 
                    <Input
                        placeholder="Password"
                        autoComplete="password"
                        textContentType="password"
                        secureTextEntry
                        className="mb-4"
                    />

                    <Input
                        placeholder="Confirm Password"
                        autoComplete="password"
                        textContentType="password"
                        secureTextEntry
                        className="mb-4"
                    /> */}

                    <Pressable onPress={handleRegister} className="bg-accent py-3 rounded-lg">
                        <Text className="text-white text-center font-semibold text-lg">
                            Sign Up
                        </Text>
                    </Pressable>

                    <Link href="/auth/login" replace className="mt-6 text-center text-accent mb-10">
                        Already have an account?{" "}
                        <Text className="font-semibold">Log In here</Text>
                    </Link>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
