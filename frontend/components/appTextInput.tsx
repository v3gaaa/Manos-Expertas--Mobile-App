import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
  } from "react-native";
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

const AppTextInput: React.FC<TextInputProps> = ({ value, onChangeText, secureTextEntry, ...otherProps }) => {
    const [focused, setFocused] = useState<boolean>(false);

    return (
        <TextInput 
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={value}
            onChangeText={onChangeText}
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
            {...otherProps}
        />
    );
};

export default AppTextInput;