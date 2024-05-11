import {useState} from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Image,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Row, Table} from "react-native-table-component";
import {IconButton} from "react-native-paper";

import {deleteReview, getAllReview} from "../../../lib/appwrite";
import useAppwrite from "../../../lib/useAppwrite";

const ManageReview = () => {
  const {data: reviews, refetch} = useAppwrite(() => getAllReview());

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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
      "User",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [200, 400, 200, 300, 300, 200, 200, 200],
  });

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteReview(id);
    await refetch();
    setLoading(false);
  };

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
          <Text className="text-center font-bold text-xl">
            No Reviews found.
          </Text>
        ) : (
          <View style={styles.container}>
            <Text className="mb-5 text-xl font-bold">All Reviews</Text>
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
                            source={{uri: review.product.images[0]}}
                            alt="product"
                            className="h-12 w-12 rounded"
                            resizeMode="cover"
                          />
                          <Text className="capitalize font-bold">
                            {review.product.title}
                          </Text>
                        </View>,
                        <View className="flex flex-row gap-2 ml-3">
                          <Image
                            source={{uri: review.user.avatar}}
                            alt="user"
                            className="h-12 w-12 rounded"
                            resizeMode="cover"
                          />
                          <View className="gap-1">
                            <Text className="font-bold">
                              {review.user.name}
                            </Text>
                            <Text className="font-bold">
                              {review.user.email}
                            </Text>
                          </View>
                        </View>,
                        new Date(review.$createdAt).toLocaleDateString(),
                        new Date(review.$updatedAt).toLocaleDateString(),
                        <View className="ml-[45px]">
                          <IconButton
                            icon="trash-can"
                            mode="contained"
                            iconColor="#e10a11"
                            size={28}
                            onPress={() => handleDelete(review.$id)}
                            loading={loading}
                            disabled={loading}
                          />
                        </View>,
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

export default ManageReview;

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
