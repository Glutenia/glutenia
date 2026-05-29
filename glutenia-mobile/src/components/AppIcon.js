import { StyleSheet, Text } from "react-native";

const symbols = {
  add: "+",
  "add-circle": "+",
  "arrow-back": "<",
  basket: "Cart",
  card: "Pay",
  cash: "$",
  checkmark: "OK",
  "checkmark-circle": "OK",
  close: "x",
  "close-circle": "x",
  cube: "Prod",
  ellipse: ".",
  grid: "Dash",
  home: "Home",
  image: "Img",
  leaf: "GF",
  list: "=",
  "log-in": ">",
  "log-out": "<",
  pencil: "Edit",
  person: "User",
  "person-add": "+User",
  "person-circle": "User",
  receipt: "Ord",
  refresh: "R",
  remove: "-",
  save: "OK",
  search: "Find",
  trash: "Del",
  "bread-slice": "Bread",
  noodles: "Pasta",
  "food-variant": "Snack",
  sack: "Flour",
  cupcake: "Sweet",
};

export default function AppIcon({ name, size = 18, color = "#000", style }) {
  const label = symbols[name] || ".";
  const isWord = label.length > 1;

  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.icon,
        {
          color,
          fontSize: isWord ? Math.max(10, size * 0.52) : size,
          minWidth: Math.max(size, isWord ? size * 1.8 : size),
          lineHeight: Math.max(size, 18),
        },
        style,
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontWeight: "900",
    textAlign: "center",
    includeFontPadding: false,
  },
});
