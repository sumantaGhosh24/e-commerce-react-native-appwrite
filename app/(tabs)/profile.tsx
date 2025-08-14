import {useState} from "react";
import {useWindowDimensions} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {SceneMap, TabView} from "react-native-tab-view";

import {ProfileDetails, ProfileUpdate, ProfileUpdateImage} from "@/components";

const renderScene = SceneMap({
  details: ProfileDetails,
  update: ProfileUpdate,
  image: ProfileUpdateImage,
});

const Profile = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: "details", title: "Details"},
    {key: "update", title: "Update"},
    {key: "image", title: "Update Image"},
  ]);

  return (
    <SafeAreaView className="h-full mx-3">
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        style={{marginTop: 10}}
      />
    </SafeAreaView>
  );
};

export default Profile;
