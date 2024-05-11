import {ActivityIndicator, Dimensions, Platform, View} from "react-native";

const Loader = ({isLoading}) => {
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View
      style={{
        height: screenHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        zIndex: 999,
      }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#2563eb"
        size={osName === "ios" ? "large" : 50}
      />
    </View>
  );
};

export default Loader;
