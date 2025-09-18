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
import { Text } from "@/components/ui/text";
import { registerUser } from "@/services/auth"; // ✅ import registerUser
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterPage() {
    // form states
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [storeName, setStoreName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [address, setAddress] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // error dialog
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();

    const handleRegister = async () => {
        // ✅ validation first
        if (!firstName || !lastName || !email || !password) {
            setMessage("Please fill in all required fields.");
            setOpen(true);
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            setOpen(true);
            return;
        }

        try {
            const data = await registerUser(
                firstName,
                middleName || undefined,
                lastName,
                email,
                password,
                storeName,
                birthday || undefined,
                address || undefined
            );

            await AsyncStorage.setItem("token", data.token);

            router.replace("/dashboard"); // go to dashboard
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Registration failed");
            setOpen(true);
            console.error(error);
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
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "flex-end",
                        paddingHorizontal: 24,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text className="text-3xl font-bold text-center mb-8 text-accent">
                        Register
                    </Text>

                    <Input
                        placeholder="First Name*"
                        value={firstName}
                        onChangeText={setFirstName}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Middle Name"
                        value={middleName}
                        onChangeText={setMiddleName}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Last Name*"
                        value={lastName}
                        onChangeText={setLastName}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Email*"
                        value={email}
                        onChangeText={setEmail}
                        autoComplete="email"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        className="mb-4"
                    />
                    <Input
                        placeholder="Store Name"
                        value={storeName}
                        onChangeText={setStoreName}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Birthday"
                        value={birthday}
                        onChangeText={setBirthday}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                        className="mb-4"
                    />

                    {/* password */}
                    <PasswordInput
                        placeholder="Password*"
                        value={password}
                        onChangeText={setPassword}
                    />
                    <PasswordInput
                        placeholder="Confirm Password*"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <Pressable
                        onPress={handleRegister}
                        className="bg-accent py-3 rounded-lg mt-4"
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            Sign Up
                        </Text>
                    </Pressable>

                    <Link
                        href="/auth/login"
                        replace
                        className="mt-6 text-center text-neutral-50 mb-10"
                    >
                        Already have an account?{" "}
                        <Text className="font-semibold text-accent text-sm">
                            Log In here
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
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
