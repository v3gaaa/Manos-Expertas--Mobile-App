import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
  } from "react-native";
import { Theme } from '../constants/theme';
import spacing from '../constants/spacing';
import fonts from '../constants/fonts';

const AppTextInput: React.FC<TextInputProps> = ({...otherProps}) => {
    const initialState = ''; // Replace '' with the initial state value you want to use
    const [focused, setFocused] = useState<boolean>(false);
    return (
        <TextInput 
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholderTextColor={Theme.colors.babyGrey}
            style={[{
                fontFamily: fonts.PoppinsMedium,
                fontSize: Theme.size.sm,
                backgroundColor: Theme.colors.almostWhite,
                padding: spacing*2,
                borderRadius: spacing,
                marginBottom: spacing*1.5,
                marginVertical: spacing,
            }, focused && {borderWidth:2, borderColor:Theme.colors.bamxYellow, ...Theme.shadows.shadow}]}
            {...otherProps}
        />
    );
};

const styles = StyleSheet.create({})

export default AppTextInput;
