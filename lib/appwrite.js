import {
  Account,
  Client,
  Databases,
  Query,
  Storage,
  ID,
} from "react-native-appwrite";

import {
  APPWRITE_DATABASE_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PLATFORM,
  APPWRITE_PROJECT_ID,
  APPWRITE_STORAGE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_CATEGORY_COLLECTION_ID,
  APPWRITE_BOOKING_COLLECTION_ID,
  APPWRITE_PRODUCT_COLLECTION_ID,
  APPWRITE_REVIEW_COLLECTION_ID,
  APPWRITE_CART_COLLECTION_ID,
  APPWRITE_CARTITEM_COLLECTION_ID,
} from "./config";

export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  platform: APPWRITE_PLATFORM,
  projectId: APPWRITE_PROJECT_ID,
  storageId: APPWRITE_STORAGE_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  categoryCollectionId: APPWRITE_CATEGORY_COLLECTION_ID,
  bookingCollectionId: APPWRITE_BOOKING_COLLECTION_ID,
  productCollectionId: APPWRITE_PRODUCT_COLLECTION_ID,
  reviewCollectionId: APPWRITE_REVIEW_COLLECTION_ID,
  cartCollectionId: APPWRITE_CART_COLLECTION_ID,
  cartItemCollectionId: APPWRITE_CARTITEM_COLLECTION_ID,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);

// user authentication
export const createUser = async (form) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      form.email,
      form.password,
      form.username
    );

    if (!newAccount) throw Error;

    await signIn(form.email, form.password);

    const data = await uploadFile(form.thumbnail, "image");

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: form.email,
        username: form.username,
        name: form.name,
        city: form.city,
        state: form.state,
        country: form.country,
        zip: form.zip,
        addressline: form.addressline,
        avatar: data.fileUrl,
        avatarId: data.fileId,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    return null;
  }
};

export const updateUser = async (form) => {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      form.userId,
      {
        city: form.city,
        state: form.state,
        country: form.country,
        zip: form.zip,
        addressline: form.addressline,
      }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUserImage = async (userId, avatar, avatarId) => {
  try {
    await deleteFile(avatarId);

    const data = await uploadFile(avatar, "image");

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {avatar: data.fileUrl, avatarId: data.fileId}
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllUsers = async () => {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );

    return users.documents;
  } catch (error) {
    throw new Error(error);
  }
};

// database product
export const createProduct = async (form) => {
  try {
    const imageUrls = await Promise.all(
      form.images.map(async (img) => {
        const imageData = await uploadFile(img, "image");
        return imageData.fileUrl;
      })
    );

    const newProduct = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      ID.unique(),
      {
        title: form.title,
        description: form.description,
        images: imageUrls,
        price: parseInt(form.price),
        category: form.category,
        user: form.user,
      }
    );

    return newProduct;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllProduct = async () => {
  try {
    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId
    );

    return products.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProduct = async (id) => {
  try {
    const product = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      id
    );
    if (!product) throw Error;

    return product;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProduct = async (productId, form) => {
  try {
    const updatedProduct = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      productId,
      {
        title: form.title,
        description: form.description,
        price: parseInt(form.price),
        category: form.category,
      }
    );

    return updatedProduct;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      id
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const searchProduct = async (query) => {
  try {
    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productCollectionId,
      [Query.search("title", query)]
    );

    if (!products) throw new Error("Something went wrong.");

    return products.documents;
  } catch (error) {
    throw new Error(error);
  }
};

// database review
export const createReview = async (form) => {
  try {
    const newReview = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reviewCollectionId,
      ID.unique(),
      {
        message: form.message,
        rating: parseInt(form.rating),
        user: form.userId,
        product: form.productId,
      }
    );

    return newReview;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllReview = async () => {
  try {
    const reviews = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reviewCollectionId
    );

    return reviews.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserReview = async (userId) => {
  try {
    const reviews = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reviewCollectionId,
      [Query.equal("user", userId)]
    );

    return reviews.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductReview = async (productId) => {
  try {
    const reviews = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reviewCollectionId,
      [Query.equal("product", productId)]
    );

    return reviews.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteReview = async (id) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reviewCollectionId,
      id
    );
  } catch (error) {
    throw new Error(error);
  }
};

// database cart
export const getCart = async (userId) => {
  try {
    const cart = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.cartCollectionId,
      [Query.equal("user", userId), Query.equal("status", "progress")]
    );

    return cart.documents[0];
  } catch (error) {
    throw new Error(error);
  }
};

export const addCartItem = async (userId, productId) => {
  try {
    const cart = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.cartCollectionId,
      [Query.equal("user", userId), Query.equal("status", "progress")]
    );

    if (cart.total !== 0) {
      const cartItem = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.cartItemCollectionId,
        [
          Query.equal("cart", cart.documents[0].$id),
          Query.equal("product", productId),
        ]
      );

      if (cartItem.total !== 0) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.cartItemCollectionId,
          cartItem.documents[0].$id,
          {
            quantity: cartItem.documents[0].quantity + 1,
          }
        );
      } else {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.cartItemCollectionId,
          ID.unique(),
          {product: productId, quantity: 1, cart: cart.documents[0].$id}
        );
      }
    } else {
      const newCart = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.cartCollectionId,
        ID.unique(),
        {
          user: userId,
        }
      );

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.cartItemCollectionId,
        ID.unique(),
        {
          product: productId,
          quantity: 1,
          cart: newCart.$id,
        }
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const removeCartItem = async (id, qty) => {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.cartItemCollectionId,
      id,
      {quantity: qty - 1}
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCartItem = async (id) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.cartItemCollectionId,
      id
    );
  } catch (error) {
    throw new Error(error);
  }
};

// database booking
export const createBooking = async (cartId, userId, price) => {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      ID.unique(),
      {
        user: userId,
        price: parseInt(price),
        cart: cartId,
      }
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.cartCollectionId,
      cartId,
      {status: "complete"}
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllBooking = async () => {
  try {
    const bookings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId
    );

    return bookings.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getBooking = async (id) => {
  try {
    const booking = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      id
    );
    if (!booking) throw Error;

    return booking;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateBooking = async (bookingId, status) => {
  try {
    const updatedBooking = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      bookingId,
      {
        status: status,
      }
    );

    return updatedBooking;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserBooking = async (id) => {
  try {
    const booking = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      Query.equal("user", id)
    );

    return booking.documents;
  } catch (error) {}
};

// database category
export const createCategory = async (form) => {
  try {
    const data = await uploadFile(form.image, "image");

    const newCategory = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId,
      ID.unique(),
      {
        name: form.name,
        image: data.fileUrl,
        imageId: data.fileId,
      }
    );

    return newCategory;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllCategory = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId
    );

    return categories.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCategory = async (id) => {
  try {
    const category = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId,
      id
    );
    if (!category) throw Error;

    return category;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateCategory = async (categoryId, name) => {
  try {
    const updatedCategory = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId,
      categoryId,
      {
        name: name,
      }
    );

    return updatedCategory;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateCategoryImage = async (categoryId, imageId, image) => {
  try {
    await deleteFile(imageId);

    const data = await uploadFile(image, "image");

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId,
      categoryId,
      {
        image: data.fileUrl,
        imageId: data.fileId,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCategory = async (id, fileId) => {
  try {
    await deleteFile(fileId);

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId,
      id
    );
  } catch (error) {
    throw new Error(error);
  }
};

// database dashboard
export const getDashboard = async () => {
  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId
  );
  const category = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.categoryCollectionId
  );
  const product = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.productCollectionId
  );
  const review = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.reviewCollectionId
  );
  const allBooking = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookingCollectionId
  );
  const codBooking = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookingCollectionId,
    Query.equal("method", "cod")
  );
  const onlineBooking = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookingCollectionId,
    Query.equal("method", "online")
  );
  const successBooking = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookingCollectionId,
    Query.equal("status", "success")
  );
  const pendingBooking = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookingCollectionId,
    Query.equal("status", "pending")
  );
  const cancelBooking = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.bookingCollectionId,
    Query.equal("status", "cancel")
  );

  return {
    user: user.total,
    category: category.total,
    product: product.total,
    review: review.total,
    allBookingCount: allBooking.total,
    codBooking: codBooking.total,
    onlineBooking: onlineBooking.total,
    successBooking: successBooking.total,
    pendingBooking: pendingBooking.total,
    cancelBooking: cancelBooking.total,
    allBooking,
  };
};

// storage
export const uploadFile = async (file, type) => {
  if (!file) return;

  const {mimeType, ...rest} = file;
  const asset = {type: mimeType, ...rest};

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return {fileUrl, fileId: uploadedFile.$id};
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId) => {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteFile = async (fileId) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return;
  } catch (error) {
    throw new Error(error);
  }
};
