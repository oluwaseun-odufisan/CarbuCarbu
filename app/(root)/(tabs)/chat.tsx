import { useState, useRef, useEffect } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";

interface Message {
  id: string;
  sender: "rider" | "driver";
  text: string;
  timestamp: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "rider",
    text: "Hello, I just booked a ride. Are you on your way?",
    timestamp: "9:30 AM",
  },
  {
    id: "2",
    sender: "driver",
    text: "Yes, Oluwaseun! I dey road now, abeg. I go reach you in like 5 minutes.",
    timestamp: "9:32 AM",
  },
  {
    id: "3",
    sender: "rider",
    text: "Okay, nice one! Where you dey now?",
    timestamp: "9:33 AM",
  },
  {
    id: "4",
    sender: "driver",
    text: "I just pass Berger bus stop. You dey around Ikeja, abi?",
    timestamp: "9:34 AM",
  },
  {
    id: "5",
    sender: "rider",
    text: "Yes, I dey Ikeja, close to Computer Village. Abeg hurry small, I get meeting.",
    timestamp: "9:35 AM",
  },
  {
    id: "6",
    sender: "driver",
    text: "No wahala, I dey come sharp sharp. Look out for a black Toyota Corolla.",
    timestamp: "9:36 AM",
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Scroll to the latest message when messages update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: `${messages.length + 1}`,
      sender: "rider",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate driver response (for mock purposes)
    setTimeout(() => {
      const driverReply: Message = {
        id: `${messages.length + 2}`,
        sender: "driver",
        text: "Alright, I dey almost there. Two minutes max!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, driverReply]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row mb-3 ${
        item.sender === "rider" ? "justify-end" : "justify-start"
      }`}
    >
      <View
        className={`max-w-[70%] p-3 rounded-lg ${
          item.sender === "rider"
            ? "bg-primary-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        <Text
          className={`text-base font-JakartaMedium ${
            item.sender === "rider" ? "text-white" : "text-black"
          }`}
        >
          {item.text}
        </Text>
        <Text
          className={`text-xs font-JakartaRegular mt-1 ${
            item.sender === "rider" ? "text-white/70" : "text-gray-600"
          }`}
        >
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View className="flex-row items-center px-5 py-3 border-b border-gray-200">
          <Image
            source={icons.profile}
            className="w-10 h-10 rounded-full mr-3"
            resizeMode="contain"
          />
          <Text className="text-xl font-JakartaBold text-primary-500">
            Driver: Chukwudi
          </Text>
        </View>

        {messages.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Image
              source={images.message}
              className="w-40 h-40"
              resizeMode="contain"
            />
            <Text className="text-2xl font-JakartaBold mt-3 text-primary-500">
              No Messages Yet
            </Text>
            <Text className="text-base font-JakartaMedium mt-2 text-gray-600 text-center px-7">
              Start chatting with your driver.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        <View className="flex-row items-center px-5 py-3 border-t border-gray-200">
          <InputField
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            containerStyle="flex-1 mr-3"
            className="h-12"
            icon={icons.message}
          />
          <CustomButton
            title=""
            onPress={handleSendMessage}
            className="w-12 h-12 rounded-full bg-primary-500"
            IconLeft={() => (
              <Image
                source={icons.send}
                className="w-6 h-6"
                resizeMode="contain"
                style={{ tintColor: "#FFFFFF" }}
              />
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
