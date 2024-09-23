import { Modifier } from "./modifier";
import { Product } from "./product";
import { Operator } from "./operator";
import { ProductType } from "./productType";
import { loadLocalization } from "../IO/io";

export async function initAll(): Promise<void> {
  await Promise.all([
    Operator.loadOperators(),
    ProductType.loadProductTypes()
  ]);
  await Product.loadProducts();
  await Modifier.loadModifiers();
  await loadLocalization();
}