export interface IInterfaceGearItem {
  title: string;
  description?: string;
  category: string;
  price: number;
  brand: string;
  quantity: number;
  gearItemImage: string;
}
export interface IFilterGearItem {
  category: string;
  price: number;
  brand: string;
}
