import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Input } from "./ui/input";

function PasswordInput({ placeholder, value, onChangeText }: any) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className="relative mb-4">
            <Input
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!showPassword}
                placeholderTextColor="#aaa"
                className=""
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

