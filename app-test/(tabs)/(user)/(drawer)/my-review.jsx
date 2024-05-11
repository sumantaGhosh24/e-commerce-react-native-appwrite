import {useState} from "react";
import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  Image,
  StyleSheet,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Row, Table} from "react-native-table-component";

import {useGlobalContext} from "../../../../context/GlobalProvider";
import {getUserReview} from "../../../../lib/appwrite";
import useAppwrite from "../../../../lib/useAppwrite";

const MyReview = () => {
  const {user} = useGlobalContext();
  const {data: reviews, refetch} = useAppwrite(() => getUserReview(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "Message",
      "Rating",
      "Product",
      "Created At",
      "Updated At",
    ],
    widthArr: [200, 400, 200, 300, 200, 200],
  });

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="px-3"
      >
        {reviews.length === 0 ? (
          <Text className="text-xl text-center font-bold">
            No reviews found.
          </Text>
        ) : (
          <View style={styles.container}>
            <Text className="mb-5 text-xl font-bold">My Reviews</Text>
            <ScrollView horizontal={true} className="mb-5">
              <View>
                <Table borderStyle={{borderWidth: 1, borderColor: "purple"}}>
                  <Row
                    data={data.tableHead}
                    widthArr={data.widthArr}
                    style={styles.head}
                    textStyle={styles.headText}
                  />
                </Table>
                <ScrollView>
                  <Table borderStyle={{borderWidth: 1, borderColor: "purple"}}>
                    {reviews
                      .map((review) => [
                        review.$id,
                        review.message,
                        review.rating,
                        <View className="flex flex-row items-center gap-2 ml-3">
                          <Image
                            source={{uri: review?.product?.images[0]}}
                            className="h-12 w-12 rounded"
                            resizeMode="cover"
                          />
                          <Text className="capitalize font-bold">
                            {review?.product?.title}
                          </Text>
                        </View>,
                        new Date(review.$createdAt).toLocaleDateString(),
                        new Date(review.$updatedAt).toLocaleTimeString(),
                      ])
                      .map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={data.widthArr}
                          style={styles.rowSection}
                          textStyle={styles.text}
                        />
                      ))}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 7,
  },
  rowSection: {
    height: 100,
    backgroundColor: "#E7E6E1",
  },
  head: {
    height: 40,
    backgroundColor: "#2563eb",
  },
  headText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  text: {
    margin: 6,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
