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
import {deleteCategory, getAllCategory} from "../../../../lib/appwrite";

const ManageCategory = () => {
  const {data: categories, refetch} = useAppwrite(() => getAllCategory());

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: ["Id", "Name", "Image", "Created At", "Updated At", "Actions"],
    widthArr: [200, 200, 200, 200, 200, 200],
  });

  const handleDelete = async (id, imageId) => {
    setLoading(true);
    await deleteCategory(id, imageId);
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
          onPress={() => router.push("/category/create")}
        >
          Create Category
        </Button>

        {categories.length === 0 ? (
          <Text className="text-center mt-5 font-bold text-xl">
            No category found.
          </Text>
        ) : (
          <View style={styles.container}>
            <Text className="mb-5 text-xl font-bold">All Categories</Text>
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
                    {categories
                      .map((cat) => [
                        cat.$id,
                        cat.name,
                        <Image
                          source={{uri: cat.image}}
                          alt={cat.imageId}
                          className="h-[60px] max-w-[100px] rounded ml-[50px]"
                          resizeMode="cover"
                        />,
                        new Date(cat.$createdAt).toLocaleDateString(),
                        new Date(cat.$updatedAt).toLocaleDateString(),
                        <View className="flex flex-row ml-[45px]">
                          <IconButton
                            icon="update"
                            mode="contained"
                            iconColor="#1ac50e"
                            size={28}
                            onPress={() =>
                              router.push(`/category/update/${cat.$id}`)
                            }
                          />
                          <IconButton
                            icon="trash-can"
                            mode="contained"
                            iconColor="#e10a11"
                            size={28}
                            onPress={() => handleDelete(cat.$id, cat.imageId)}
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

export default ManageCategory;

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
