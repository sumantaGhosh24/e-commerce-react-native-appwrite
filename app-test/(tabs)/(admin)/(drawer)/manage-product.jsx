import {useState} from "react";
import {
  ScrollView,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  Image,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Row, Table} from "react-native-table-component";
import {Button, IconButton} from "react-native-paper";
import {router} from "expo-router";

import useAppwrite from "../../../../lib/useAppwrite";
import {deleteProduct, getAllProduct} from "../../../../lib/appwrite";

const ManageProduct = () => {
  const {data: products, refetch} = useAppwrite(() => getAllProduct());

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
      "Title",
      "Description",
      "Price",
      "Images",
      "Category",
      "Created By",
      "Created At",
      "Updated At",
      "Actions",
    ],
    widthArr: [200, 300, 500, 200, 250, 250, 250, 200, 200, 200],
  });

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteProduct(id);
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
        <Button
          mode="contained"
          buttonColor="#2563eb"
          onPress={() => router.push("/product/create")}
        >
          Create Product
        </Button>
        {products.length === 0 ? (
          <Text className="text-center mt-5 font-bold text-xl">
            No Products found.
          </Text>
        ) : (
          <View style={styles.container}>
            <Text className="mb-5 text-xl font-bold">All Products</Text>
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
                    {products
                      .map((product) => [
                        product.$id,
                        product.title,
                        product.description,
                        product.price,
                        <View className="flex flex-row gap-2 ml-3">
                          {product.images.map((img, i) => (
                            <Image
                              key={i}
                              source={{uri: img}}
                              alt="image"
                              className="h-12 w-12 rounded"
                              resizeMode="cover"
                            />
                          ))}
                        </View>,
                        <View className="flex flex-row items-center gap-2 ml-3">
                          <Image
                            source={{uri: product.category.image}}
                            alt="category"
                            className="h-12 w-12 rounded"
                            resizeMode="cover"
                          />
                          <Text className="capitalize font-bold">
                            {product.category.name}
                          </Text>
                        </View>,
                        <View className="flex flex-row gap-2 ml-3">
                          <Image
                            source={{uri: product.user.avatar}}
                            alt="user"
                            className="h-12 w-12 rounded"
                            resizeMode="cover"
                          />
                          <View className="gap-1">
                            <Text className="font-bold">
                              {product.user.name}
                            </Text>
                            <Text className="font-bold">
                              {product.user.email}
                            </Text>
                          </View>
                        </View>,
                        new Date(product.$createdAt).toLocaleDateString(),
                        new Date(product.$updatedAt).toLocaleDateString(),
                        <View className="flex flex-row ml-[45px]">
                          <IconButton
                            icon="update"
                            mode="contained"
                            iconColor="#1ac50e"
                            size={28}
                            onPress={() =>
                              router.push(`/product/update/${product.$id}`)
                            }
                          />
                          <IconButton
                            icon="trash-can"
                            mode="contained"
                            iconColor="#e10a11"
                            size={28}
                            onPress={() => handleDelete(product.$id)}
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

export default ManageProduct;

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
