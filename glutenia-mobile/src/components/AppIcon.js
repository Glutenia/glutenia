import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Circle,
  CircleCheck,
  CirclePlus,
  CircleX,
  ClipboardList,
  CreditCard,
  Edit3,
  Grid3X3,
  Home,
  ImagePlus,
  Leaf,
  List,
  LogIn,
  LogOut,
  Minus,
  Package,
  Search,
  ShoppingBasket,
  Trash2,
  User,
  UserPlus,
  Wheat,
  X,
} from "lucide-react-native";

const icons = {
  add: CirclePlus,
  "add-circle": CirclePlus,
  "arrow-back": ArrowLeft,
  basket: ShoppingBasket,
  card: CreditCard,
  cash: Banknote,
  checkmark: CircleCheck,
  "checkmark-circle": CircleCheck,
  close: X,
  "close-circle": CircleX,
  cube: Package,
  ellipse: Circle,
  grid: Grid3X3,
  home: Home,
  image: ImagePlus,
  leaf: Leaf,
  list: List,
  "log-in": LogIn,
  "log-out": LogOut,
  pencil: Edit3,
  person: User,
  "person-add": UserPlus,
  "person-circle": User,
  receipt: ClipboardList,
  refresh: Circle,
  remove: Minus,
  save: BadgeCheck,
  search: Search,
  trash: Trash2,
  "bread-slice": Wheat,
  noodles: Package,
  "food-variant": ShoppingBasket,
  sack: Package,
  cupcake: Circle,
};

export default function AppIcon({
  name,
  size = 18,
  color = "#000",
  strokeWidth = 2.4,
  style,
}) {
  const Icon = icons[name] || Circle;
  return (
    <Icon
      color={color}
      size={size}
      strokeWidth={strokeWidth}
      style={style}
    />
  );
}
