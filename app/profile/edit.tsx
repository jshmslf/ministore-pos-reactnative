import API from "@/services/api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfile() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        birthday: "",
        address: "",
        storeName: "",
    });

    const [birthdayDate, setBirthdayDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const [dialog, setDialog] = useState<{
        visible: boolean;
        message: string;
        onClose?: () => void;
    }>({ visible: false, message: "" });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await API.get("/auth/me");
                setForm({
                    firstName: data.firstName || "",
                    middleName: data.middleName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    birthday: data.birthday
                        ? new Date(data.birthday).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })
                        : "",
                    address: data.address || "",
                    storeName: data.storeName || "",
                });
                if (data.birthday) setBirthdayDate(new Date(data.birthday));
            } catch (err) {
                console.error("Fetch user failed:", err);
                setDialog({ visible: true, message: "Failed to load profile" });
            }
        };
        fetchUser();
    }, []);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === "ios");
        if (selectedDate) {
            setBirthdayDate(selectedDate);
            setForm({
                ...form,
                birthday: selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
            });
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const payload: any = { ...form };
            if (birthdayDate) payload.birthday = birthdayDate.toISOString();
            else payload.birthday = null;

            await API.put("/auth/me", payload);

            setDialog({
                visible: true, message: "Profile updated successfully!", onClose: () => {
                    setDialog({ visible: false, message: "" });
                    router.back();
                }
            });
        } catch (err: any) {
            console.error("Update failed:", err.response?.data || err);
            setDialog({
                visible: true,
                message: err.response?.data?.message || "Failed to update profile",
                onClose: () => setDialog({ visible: false, message: "" }),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-4">
            <ScrollView>
                <Text className="text-2xl font-bold text-accent mb-4">Edit Profile</Text>

                {["firstName", "middleName", "lastName", "email", "storeName", "address"].map((key) => (
                    <TextInput
                        key={key}
                        className="bg-neutral-900 text-white p-3 mb-4 rounded-lg"
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={(form as any)[key]}
                        onChangeText={(text) => setForm({ ...form, [key]: text })}
                    />
                ))}

                <Pressable
                    className="bg-neutral-900 p-3 mb-4 rounded-lg"
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text className="text-white">{form.birthday || "Select Birthday"}</Text>
                </Pressable>

                {showDatePicker && (
                    <DateTimePicker
                        value={birthdayDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}

                <Pressable
                    className="bg-accent py-3 rounded-lg items-center"
                    onPress={handleSave}
                >
                    <Text className="text-white font-bold">Save Changes</Text>
                </Pressable>

                {/* Custom Dialog */}
                <Modal
                    visible={dialog.visible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setDialog({ ...dialog, visible: false })}
                >
                    <View className="flex-1 justify-center items-center bg-black/40">
                        <View className="bg-neutral-900 p-6 rounded-lg w-3/4">
                            <Text className="text-white text-center mb-4">{dialog.message}</Text>
                            <Pressable
                                className="bg-accent py-2 rounded-lg"
                                onPress={() => dialog.onClose && dialog.onClose()}
                            >
                                <Text className="text-white text-center font-bold">OK</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}
