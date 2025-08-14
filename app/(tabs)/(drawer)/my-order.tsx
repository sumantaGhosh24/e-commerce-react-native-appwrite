import {router} from "expo-router";
import {useState} from "react";
import {RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {IconButton} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Row, Table} from "react-native-table-component";

import {useGlobalContext} from "@/context/global-provider";
import {getUserBooking} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface OrderProps {
  $id: string;
  method: string;
  price: number;
  status: string;
  $createdAt: any;
  $updatedAt: any;
}

const MyOrder = () => {
  const {user} = useGlobalContext();
  const {data: orders, refetch} = useAppwrite(() => getUserBooking(user.$id));

  const typedOrders = orders as unknown as OrderProps[];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "Method",
      "Price",
      "Status",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [200, 200, 200, 200, 200, 200, 200],
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
                    {typedOrders
                      .map((order) => [
                        order.$id,
                        <View
                          className="mx-auto bg-primary rounded-xl"
                          key={order.$id}
                        >
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
                          key={order.$id}
                        >
                          <Text className="text-white p-2 uppercase font-bold">
                            {order.status}
                          </Text>
                        </View>,
                        new Date(order.$createdAt).toLocaleDateString(),
                        new Date(order.$updatedAt).toLocaleDateString(),
                        <View
                          className="flex flex-row ml-[45px]"
                          key={order.$id}
                        >
                          <IconButton
                            icon="eye"
                            mode="contained"
                            iconColor="#1ac50e"
                            size={28}
                            onPress={() =>
                              router.push(`/order/details/${order.$id}`)
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

export default MyOrder;

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
