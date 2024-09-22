import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    Alert,
  } from "react-native";
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

interface AppTextInputProps extends TextInputProps {
  inputType?: "email" | "password" | "text";  // Add different input types
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,50}$/;  // Minimum 8, max 50, at least one letter, one number, and one special character

const AppTextInput: React.FC<AppTextInputProps> = ({ value, onChangeText, secureTextEntry, inputType = "text", ...otherProps }) => {
    const [focused, setFocused] = useState<boolean>(false);

    const handleChangeText = (text: string) => {
        if (inputType === "email") {
            if (!emailRegex.test(text)) {
                Alert.alert("Invalid email format");
                return;
            }
        } else if (inputType === "password") {
            if (!passwordRegex.test(text)) {
                Alert.alert("Password must be between 8 and 50 characters and include letters, numbers, and special characters.");
                return;
            }
        } else if (text.length > 50) {
            // General length restriction for other text inputs
            Alert.alert("Input cannot exceed 50 characters");
            return;
        }
        onChangeText?.(text);
    };

    return (
        <TextInput 
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={value}
            onChangeText={handleChangeText}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={Theme.colors.babyGrey}
            style={[
                {
                    fontFamily: fonts.PoppinsMedium,
                    fontSize: Theme.size.sm,
                    backgroundColor: Theme.colors.almostWhite,
                    padding: spacing * 2,
                    borderRadius: spacing,
                    marginBottom: spacing * 1.5,
                    marginVertical: spacing,
                }, 
                focused && {
                    borderWidth: 2, 
                    borderColor: Theme.colors.bamxYellow, 
                    ...Theme.shadows
                }
            ]}
            maxLength={inputType === "password" ? 50 : 255}  // Restrict length, passwords to 50, other text to 255
            {...otherProps}
        />
    );
};

export default AppTextInput;