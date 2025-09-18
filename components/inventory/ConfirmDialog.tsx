import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface ConfirmDialogProps {
    visible: boolean;
    title?: string;
    message?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmDialog({
    visible,
    title = "Confirm",
    message = "Are you sure?",
    onCancel,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-80 p-6 rounded-lg">
                    <Text className="text-lg font-bold mb-2">{title}</Text>
                    <Text className="text-neutral-700 mb-4">{message}</Text>

                    <View className="flex-row justify-end gap-3">
                        <Pressable
                            onPress={onCancel}
                            className="bg-gray-400 px-4 py-2 rounded"
                        >
                            <Text className="text-white">Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={onConfirm}
                            className="bg-red-600 px-4 py-2 rounded"
                        >
                            <Text className="text-white">Delete</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
