import {useState} from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Row, Table} from "react-native-table-component";

import {getAllUsers} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";

interface UserProps {
  $id: string;
  accountId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  avatarId: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  addressline: string;
  $createdAt: any;
  $updatedAt: any;
}

const ManageUser = () => {
  const {data: users, refetch} = useAppwrite(() => getAllUsers());

  const typedUsers = users as unknown as UserProps[];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [data] = useState({
    tableHead: [
      "Id",
      "Account Id",
      "Name",
      "Username",
      "Email",
      "Avatar",
      "City",
      "State",
      "Country",
      "Zip",
      "Addressline",
      "Created At",
      "Updated At",
    ],
    widthArr: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
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
        {users.length === 0 ? (
          <Text className="text-center font-bold text-xl">No users found.</Text>
        ) : (
          <View style={styles.container}>
            <Text className="mb-5 text-xl font-bold">All Users</Text>
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
                    {typedUsers
                      .map((user) => [
                        user.$id,
                        user.accountId,
                        user.name,
                        user.username,
                        user.email,
                        <Image
                          key={user.avatarId}
                          source={{uri: user.avatar}}
                          alt={user.avatarId}
                          className="h-[60px] max-w-[100px] rounded ml-[50px]"
                          resizeMode="cover"
                        />,
                        user.city,
                        user.state,
                        user.country,
                        user.zip,
                        user.addressline,
                        new Date(user.$createdAt).toLocaleDateString(),
                        new Date(user.$updatedAt).toLocaleDateString(),
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

export default ManageUser;

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
