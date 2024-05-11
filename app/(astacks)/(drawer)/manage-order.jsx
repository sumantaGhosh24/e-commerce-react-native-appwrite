import {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
  ScrollView,
} from "react-native";
import {IconButton} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Row, Table} from "react-native-table-component";
import {router} from "expo-router";

import {getAllBooking} from "../../../lib/appwrite";
import useAppwrite from "../../../lib/useAppwrite";

const ManageOrder = () => {
  const {data: orders, refetch} = useAppwrite(() => getAllBooking());

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "User",
      "Method",
      "Price",
      "Status",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [200, 200, 200, 200, 200, 200, 200, 200],
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
        {orders.length === 0 ? (
          <Text className="text-center mt-5 font-bold text-xl">
            No orders found.
          </Text>
        ) : (
          <View style={styles.container}>
            <Text className="mb-5 text-xl font-bold">All Orders</Text>
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
                    {orders
                      .map((order) => [
                        order.$id,
                        <View className="flex flex-row items-center gap-2 ml-3">
                          <Image
                            source={{uri: order.user.avatar}}
                            alt="user"
                            className="h-12 w-12 rounded"
                            resizeMode="cover"
                          />
                          <Text className="capitalize font-bold">
                            {order.user.name}
                          </Text>
                        </View>,
                        <View className="mx-auto bg-primary rounded-xl">
                          <Text className="text-white p-2 uppercase font-bold">
                            {order.method}
                          </Text>
                        </View>,
                        order.price,
                        <View
                          className={`mx-auto rounded-xl ${
                            order.status === "success"
                              ? "bg-green-500"
                              : order.status === "pending"
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                        >
                          <Text className="text-white p-2 uppercase font-bold">
                            {order.status}
                          </Text>
                        </View>,
                        new Date(order.$createdAt).toLocaleDateString(),
                        new Date(order.$updatedAt).toLocaleDateString(),
                        <View className="flex flex-row ml-[45px]">
                          <IconButton
                            icon="update"
                            mode="contained"
                            iconColor="#1ac50e"
                            size={28}
                            onPress={() =>
                              router.push(`/order/update/${order.$id}`)
                            }
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

export default ManageOrder;

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
