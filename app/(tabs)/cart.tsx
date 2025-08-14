import {router} from "expo-router";
import {useState} from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {Button, IconButton} from "react-native-paper";
import {SafeAreaView} from "react-native-safe-area-context";
import {Row, Table} from "react-native-table-component";

import {useGlobalContext} from "@/context/global-provider";
import {
  addCartItem,
  createBooking,
  deleteCartItem,
  getCart,
  removeCartItem,
} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface CartProps {
  $id: string;
  cartitem: {
    $id: string;
    product: {
      $id: string;
      title: string;
      images: string[];
      price: number;
    };
    quantity: number;
  }[];
}

const Cart = () => {
  const {user} = useGlobalContext();
  const {data: cart, refetch} = useAppwrite(() => getCart(user.$id));

  const typedCart = cart as unknown as CartProps;

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

  const incrementItem = async (id: string) => {
    setLoading(true);
    try {
      await addCartItem(user.$id, id);

      await refetch();
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const decrementItem = async (id: string, qty: number) => {
    if (qty === 1) {
      ToastAndroid.showWithGravityAndOffset(
        "If you do not want this item remove this.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    setLoading(true);
    try {
      await removeCartItem(id, qty);

      await refetch();
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    setLoading(true);
    try {
      await deleteCartItem(id);

      await refetch();
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (price: string) => {
    setIsSubmitting(true);
    try {
      await createBooking(typedCart.$id, user.$id, price);

      await refetch();

      router.push("/my-order");
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
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
                      {typedCart.cartitem
                        .map((item) => [
                          item.product.title,
                          <Image
                            key={item.$id}
                            source={{uri: item.product.images[0]}}
                            className="h-16 w-16 rounded ml-10"
                            resizeMode="cover"
                          />,
                          item.product.price,
                          item.quantity,
                          <View className="flex flex-row" key={item.$id}>
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
            {typedCart.cartitem.length > 0 && (
              <View style={styles.container}>
                <Text className="mb-5 text-xl font-bold">Buy Product</Text>
                <View className="mb-3 flex flex-row">
                  <Text className="font-extrabold">Total Price: INR </Text>
                  <Text className="font-bold">
                    {typedCart.cartitem.length === 1
                      ? typedCart.cartitem.map(
                          (i) => i.quantity * i.product.price
                        )
                      : typedCart.cartitem.reduce(
                          (acc, p) => acc + p.quantity * p.product.price,
                          0
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
                      // @ts-ignore
                      typedCart.cartitem.length === 1
                        ? typedCart.cartitem.map(
                            (i) => i.quantity * i.product.price
                          )
                        : typedCart.cartitem.reduce(
                            (acc, p) => acc + p.quantity * p.product.price,
                            0
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
