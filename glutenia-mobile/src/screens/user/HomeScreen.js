import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import AppIcon from "../../components/AppIcon";
import Screen from "../../components/Screen";
import SectionHeader from "../../components/SectionHeader";
import ProductCard from "../../components/ProductCard";
import EmptyState from "../../components/EmptyState";
import { useCart } from "../../context/CartContext";
import { api } from "../../api/client";
import { Colors, Radius, Spacing } from "../../theme/colors";

const categories = ["All", "Bread", "Pasta", "Snacks", "Flour", "Sweets"];

export default function HomeScreen({ navigation }) {
  const { addItem, count } = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products({
        category: category === "All" ? "" : category,
        search,
      });
      setProducts(data);
    } catch (error) {
      Alert.alert("Products", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(loadProducts, 250);
    return () => clearTimeout(handle);
  }, [category, search]);

  const headerRight = useMemo(
    () => (
      <Pressable style={styles.cartIcon} onPress={() => navigation.navigate("Cart")}>
        <AppIcon name="basket" size={22} color={Colors.primary} />
        {count > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        ) : null}
      </Pressable>
    ),
    [count, navigation]
  );

  return (
    <Screen>
      <View style={styles.container}>
        <SectionHeader eyebrow="Glutenia" title="Shop gluten-free" right={headerRight} />

        <View style={styles.searchBox}>
          <AppIcon name="search" size={19} color={Colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search bread, snacks, flour..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>

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

        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProducts} />}
          ListEmptyComponent={
            loading ? null : (
              <EmptyState
                icon="search"
                title="No products found"
                body="Try another category or search term."
              />
            )
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate("ProductDetail", { productId: item._id })}
              onAdd={() => {
                addItem(item, 1);
                Alert.alert("Added", `${item.name} is in your cart.`);
              }}
            />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cartIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.surface,
    fontSize: 10,
    fontWeight: "900",
  },
  searchBox: {
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.textDark,
    fontSize: 15,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  category: {
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
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
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  productRow: {
    gap: 12,
    marginBottom: 12,
  },
});
