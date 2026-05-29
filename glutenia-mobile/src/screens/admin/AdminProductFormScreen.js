import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Screen from "../../components/Screen";
import SectionHeader from "../../components/SectionHeader";
import Field from "../../components/Field";
import ProductVisual from "../../components/ProductVisual";
import { IconButton, PrimaryButton, SecondaryButton } from "../../components/Buttons";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";
import { Colors, Radius, Spacing } from "../../theme/colors";

const categories = ["Bread", "Pasta", "Snacks", "Flour", "Sweets", "Other"];

export default function AdminProductFormScreen({ navigation, route }) {
  const { token } = useAuth();
  const productId = route.params?.productId;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Bread");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [stock, setStock] = useState("0");
  const [isGlutenFree, setIsGlutenFree] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const loadProduct = async () => {
      try {
        const product = await api.product(productId);
        setName(product.name);
        setDescription(product.description || "");
        setPrice(String(product.price));
        setCategory(product.category);
        setImageUrl(product.imageUrl || "");
        setSelectedImage(null);
        setRemoveImage(false);
        setStock(String(product.stock || 0));
        setIsGlutenFree(Boolean(product.isGlutenFree));
      } catch (error) {
        Alert.alert("Product", error.message);
        navigation.goBack();
      }
    };

    loadProduct();
  }, [productId]);

  const save = async () => {
    const numericPrice = Number(price);
    const numericStock = Number(stock || 0);
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      nextErrors.price = "Enter a valid price.";
    }

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      nextErrors.stock = "Stock must be 0 or more.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }

    try {
      if (!token) {
        Alert.alert("Session", "Please log in again.");
        return;
      }

      setLoading(true);
      const body = {
        name: name.trim(),
        description,
        price: numericPrice,
        category,
        stock: numericStock,
        isGlutenFree,
      };

      if (removeImage) {
        body.imageUrl = "";
      }

      if (selectedImage?.dataUrl) {
        body.imageUrl = selectedImage.dataUrl;
      }

      const savedProduct = productId
        ? await api.updateProduct(token, productId, body)
        : await api.createProduct(token, body);

      if (selectedImage) {
        const savedProductId = savedProduct?._id || productId;
        if (!savedProductId) {
          throw new Error("Product saved, but the server did not return its id.");
        }

        try {
          await api.uploadProductImage(token, savedProductId, selectedImage);
        } catch (imageError) {
          if (!selectedImage.dataUrl) {
            throw imageError;
          }
        }
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Save failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photos", "Allow photo access to upload a product image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert("Image", "Could not read this image. Try another photo.");
      return;
    }

    try {
      setImageProcessing(true);
      const image = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 720 } }],
        {
          base64: true,
          compress: 0.42,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      if (!image.uri || !image.base64) {
        Alert.alert("Image", "Could not prepare this image. Try another photo.");
        return;
      }

      setSelectedImage({
        uri: image.uri,
        name: `${Date.now()}-product.jpg`,
        type: "image/jpeg",
        dataUrl: `data:image/jpeg;base64,${image.base64}`,
      });
      setRemoveImage(false);
      setImageUrl(image.uri);
    } catch (error) {
      Alert.alert("Image", "Could not prepare this image. Try another photo.");
    } finally {
      setImageProcessing(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader
          eyebrow="Inventory"
          title={productId ? "Edit product" : "Add product"}
          right={<IconButton icon="close" onPress={() => navigation.goBack()} />}
        />
        <Field
          label="Product name"
          value={name}
          error={errors.name}
          onChangeText={(value) => {
            setName(value);
            setErrors((current) => ({ ...current, name: "" }));
          }}
        />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.split}>
          <Field
            label="Price"
            value={price}
            error={errors.price}
            onChangeText={(value) => {
              setPrice(value);
              setErrors((current) => ({ ...current, price: "" }));
            }}
            keyboardType="decimal-pad"
            style={styles.flex}
          />
          <Field
            label="Stock"
            value={stock}
            error={errors.stock}
            onChangeText={(value) => {
              setStock(value);
              setErrors((current) => ({ ...current, stock: "" }));
            }}
            keyboardType="number-pad"
            style={styles.flex}
          />
        </View>
        <View style={styles.categoryWrap}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categories}>
            {categories.map((item) => (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                style={[styles.category, category === item && styles.categoryActive]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.categoryTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.imageSection}>
          <Text style={styles.label}>Product image</Text>
          <View style={styles.imagePreview}>
            <ProductVisual product={{ imageUrl, category }} size="large" />
          </View>
          <View style={styles.imageActions}>
            <SecondaryButton
              title={
                imageProcessing
                  ? "Preparing..."
                  : imageUrl
                    ? "Replace image"
                    : "Upload image"
              }
              icon="image"
              disabled={imageProcessing || loading}
              onPress={pickImage}
              style={styles.imageAction}
            />
            {imageUrl ? (
              <SecondaryButton
                title="Remove"
                icon="trash"
                disabled={imageProcessing || loading}
                onPress={() => {
                  setImageUrl("");
                  setSelectedImage(null);
                  setRemoveImage(true);
                }}
                style={styles.imageAction}
              />
            ) : null}
          </View>
        </View>
        <View style={styles.switchCard}>
          <View>
            <Text style={styles.switchTitle}>Gluten Free Certified</Text>
            <Text style={styles.switchSub}>Show the green GF badge on product cards.</Text>
          </View>
          <Switch
            value={isGlutenFree}
            onValueChange={setIsGlutenFree}
            trackColor={{ false: Colors.divider, true: Colors.secondaryPale }}
            thumbColor={isGlutenFree ? Colors.secondary : Colors.textMuted}
          />
        </View>
        <PrimaryButton
          title={productId ? "Update product" : "Save product"}
          icon="save"
          loading={loading || imageProcessing}
          disabled={imageProcessing}
          onPress={save}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  split: {
    flexDirection: "row",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  categoryWrap: {
    gap: 8,
  },
  label: {
    color: Colors.textDark,
    fontSize: 13,
    fontWeight: "700",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  category: {
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  categoryActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.textMuted,
    fontWeight: "800",
  },
  categoryTextActive: {
    color: Colors.surface,
  },
  imageSection: {
    gap: 8,
  },
  imagePreview: {
    overflow: "hidden",
  },
  imageActions: {
    flexDirection: "row",
    gap: 10,
  },
  imageAction: {
    flex: 1,
  },
  switchCard: {
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  switchTitle: {
    color: Colors.textDark,
    fontWeight: "900",
  },
  switchSub: {
    color: Colors.textMuted,
    marginTop: 4,
  },
});
