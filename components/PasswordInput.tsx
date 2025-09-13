import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

function PasswordInput({ placeholder, value, onChangeText }: any) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className="relative mb-4">
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!showPassword}
                placeholderTextColor="#aaa"
                className="border border-gray-300 rounded-lg px-4 py-3 pr-12 text-white"
            />
            <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
            >
                {showPassword ? (
                    <Eye size={20} color="white" />
                ) : (
                    <EyeOff size={20} color="white" />
                )}
            </Pressable>
        </View>
    );
}

export default PasswordInput

