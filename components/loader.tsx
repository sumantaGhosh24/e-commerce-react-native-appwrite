import {ActivityIndicator, Dimensions, Platform, View} from "react-native";

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({isLoading}: LoaderProps) => {
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
