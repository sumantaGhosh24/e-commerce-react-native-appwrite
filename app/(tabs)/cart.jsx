import {useState} from "react";
import {router} from "expo-router";
import {
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Image,
  Alert,
} from "react-native";
import {Button, IconButton} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Table, Row} from "react-native-table-component";

import {useGlobalContext} from "../../context/GlobalProvider";
import {
  addCartItem,
  createBooking,
  deleteCartItem,
  getCart,
  removeCartItem,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Cart = () => {
  const {user} = useGlobalContext();
  const {data: cart, refetch} = useAppwrite(() => getCart(user.$id));

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: ["Product", "Image", "Price", "Quantity", "Actions"],
    widthArr: [200, 200, 200, 200, 200],
  });

  const incrementItem = async (id) => {
    setLoading(true);
    try {
      await addCartItem(user.$id, id);

      await refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const decrementItem = async (id, qty) => {
    if (qty === 1) {
      return Alert.alert("Sorry", "If you do not want this item remove this.");
    }

    setLoading(true);
    try {
      await removeCartItem(id, qty);

      await refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    setLoading(true);
    try {
      await deleteCartItem(id);

      await refetch();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (price) => {
    setIsSubmitting(true);
    try {
      await createBooking(cart.$id, user.$id, price);

      await refetch();

      router.push("/my-order");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="px-3"
      >
        {!cart || cart.length === 0 ? (
          <Text className="mt-5 text-xl text-center font-bold">
            No cart found.
          </Text>
        ) : (
          <>
            <View style={styles.container}>
              <Text className="mb-5 text-xl font-bold">My Cart</Text>
              <ScrollView horizontal={true} className="mb-5">
                <View>
                  <Table borderStyle={{borderWidth: 1, borderColor: "gray"}}>
                    <Row
                      data={data.tableHead}
                      widthArr={data.widthArr}
                      style={styles.head}
                      textStyle={styles.headText}
                    />
                  </Table>
                  <ScrollView>
                    <Table borderStyle={{borderWidth: 1, borderColor: "gray"}}>
                      {cart.cartitem
                        .map((item) => [
                          item.product.title,
                          <Image
                            source={{uri: item.product.images[0]}}
                            className="h-16 w-16 rounded ml-10"
                            resizeMode="cover"
                          />,
                          item.product.price,
                          item.quantity,
                          <View className="flex flex-row">
                            <IconButton
                              icon="plus"
                              mode="contained"
                              iconColor="#2563eb"
                              size={28}
                              loading={loading}
                              disabled={loading}
                              onPress={() => incrementItem(item.product.$id)}
                            />
                            <IconButton
                              icon="minus"
                              mode="contained"
                              iconColor="#2563eb"
                              size={28}
                              loading={loading}
                              disabled={loading}
                              onPress={() =>
                                decrementItem(item.$id, item.quantity)
                              }
                            />
                            <IconButton
                              icon="close"
                              mode="contained"
                              iconColor="#eb252c"
                              size={28}
                              loading={loading}
                              disabled={loading}
                              onPress={() => removeItem(item.$id)}
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
            {cart.cartitem.length > 0 && (
              <View style={styles.container}>
                <Text className="mb-5 text-xl font-bold">Buy Product</Text>
                <View className="mb-3 flex flex-row">
                  <Text className="font-extrabold">Total Price: INR </Text>
                  <Text className="font-bold">
                    {cart.cartitem.length === 1
                      ? cart.cartitem.map((i) => i.quantity * i.product.price)
                      : cart.cartitem.reduce(
                          (a, b) =>
                            a?.quantity * a?.product?.price +
                            b?.quantity * b?.product?.price
                        )}
                  </Text>
                </View>
                <Button
                  mode="contained"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  buttonColor="#2563eb"
                  onPress={() =>
                    handleCreateBooking(
                      cart.cartitem.length === 1
                        ? cart.cartitem.map((i) => i.quantity * i.product.price)
                        : cart.cartitem.reduce(
                            (a, b) =>
                              a?.quantity * a?.product?.price +
                              b?.quantity * b?.product?.price
                          )
                    )
                  }
                >
                  Buy Now
                </Button>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;

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
