import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import AppIcon from "../components/AppIcon";
import { useAuth } from "../context/AuthContext";
import { Colors } from "../theme/colors";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/user/HomeScreen";
import ProductDetailScreen from "../screens/user/ProductDetailScreen";
import CartScreen from "../screens/user/CartScreen";
import CheckoutScreen from "../screens/user/CheckoutScreen";
import OrderSuccessScreen from "../screens/user/OrderSuccessScreen";
import UserOrdersScreen from "../screens/user/UserOrdersScreen";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminProductsScreen from "../screens/admin/AdminProductsScreen";
import AdminProductFormScreen from "../screens/admin/AdminProductFormScreen";
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen";
import AccountScreen from "../screens/AccountScreen";

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: Colors.background },
};

const tabOptions = ({ route }) => ({
  headerShown: false,
  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: Colors.textMuted,
  tabBarStyle: {
    height: 66,
    paddingBottom: 10,
    paddingTop: 8,
    backgroundColor: Colors.surface,
    borderTopColor: Colors.divider,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: "800",
  },
  tabBarIcon: ({ color, size }) => {
    const icons = {
      Home: "home",
      Cart: "basket",
      Orders: "receipt",
      Account: "person-circle",
      Dashboard: "grid",
      Products: "cube",
    };
    return <AppIcon name={icons[route.name] || "ellipse"} size={size} color={color} />;
  },
});

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function UserTabs() {
  return (
    <Tabs.Navigator screenOptions={tabOptions}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Cart" component={CartScreen} />
      <Tabs.Screen name="Orders" component={UserOrdersScreen} />
      <Tabs.Screen name="Account" component={AccountScreen} />
    </Tabs.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="UserTabs" component={UserTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tabs.Navigator screenOptions={tabOptions}>
      <Tabs.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tabs.Screen name="Products" component={AdminProductsScreen} />
      <Tabs.Screen name="Orders" component={AdminOrdersScreen} />
      <Tabs.Screen name="Account" component={AccountScreen} />
    </Tabs.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="AdminProductForm" component={AdminProductFormScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : user.role === "admin" ? <AdminStack /> : <UserStack />}
    </NavigationContainer>
  );
}
