import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-3 w-full ${className}`}>
          <Text
            className={`text-base font-PlusJakartaSans-SemiBold text-primary-700 mb-2 ${labelStyle}`}
          >
            {label}
          </Text>
          <View
            className={`flex-row items-center bg-white rounded-xl border border-primary-200 focus:border-primary-500 shadow-sm shadow-primary-300 ${containerStyle}`}
          >
            {icon && (
              <Image
                source={icon}
                className={`w-6 h-6 ml-4 mr-3 ${iconStyle}`}
                resizeMode="contain"
              />
            )}
            <TextInput
              className={`flex-1 p-4 text-base font-PlusJakartaSans-Medium text-primary-800 ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#B0C4DE"
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
