import {useState} from "react";
import {View, TouchableOpacity, TextInput, Alert} from "react-native";
import {router, usePathname} from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchInput = ({initialQuery}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 rounded-2xl border-2 border-black bg-white">
      <TextInput
        className="text-base mt-0.5 flex-1"
        value={query}
        placeholder="Search products..."
        placeholderTextColor="#000"
        onChangeText={(e) => setQuery(e)}
      />
      <View className="flex flex-row gap-1.5">
        <TouchableOpacity
          onPress={() => {
            if (query === "")
              return Alert.alert(
                "Missing Query",
                "Please input something to search."
              );
            if (pathname.startsWith("/search")) router.setParams({query});
            else router.push(`/search/${query}`);
          }}
          className="bg-gray-200 rounded-full p-1"
        >
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setQuery("")}
          className="bg-gray-200 rounded-full p-1"
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchInput;
