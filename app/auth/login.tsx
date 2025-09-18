import PasswordInput from "@/components/PasswordInput";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth"; // ✅ import API function
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // error dialog state
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage("Please fill in both email and password!");
            setOpen(true);
            return;
        }

        try {
            const data = await loginUser(email, password);

            // ✅ save JWT token
            await AsyncStorage.setItem("token", data.token);

            // go to dashboard
            router.replace("/dashboard");
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Invalid email or password");
            setOpen(true);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="light" />
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <View className="flex-1 justify-end px-6">
                    <Text className="text-center text-accent font-black mb-[15rem] text-5xl">SariPOS</Text>

                    <Text className="text-3xl font-bold text-center mb-8 text-accent">
                        Login
                    </Text>

                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoComplete="email"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        className="mb-4"
                    />

                    <PasswordInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Pressable onPress={handleLogin} className="bg-accent py-3 rounded-lg mt-4">
                        <Text className="text-white text-center font-semibold text-lg">
                            Log In
                        </Text>
                    </Pressable>

                    <Link
                        href="/auth/register"
                        replace
                        className="mt-6 text-center text-neutral-50 mb-10"
                    >
                        {`Don't have an account?`}{" "}
                        <Text className="font-semibold text-accent text-sm">
                            Sign Up here
                        </Text>
                    </Link>

                    {/* ALERT */}
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>ERROR</AlertDialogTitle>
                                <AlertDialogDescription>{message}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    <Text className="text-neutral-300">OK</Text>
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
