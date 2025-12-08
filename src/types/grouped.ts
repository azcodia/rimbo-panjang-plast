import { StockData } from "@/context/StockContext";

export interface GroupedStock {
  color_name: string;
  items: StockData[];
}

export interface GroupedStockData {
  color_name: string;
  color_id: string;
  sizes: {
    id: string;
    size: string;
    heavy: string;
    quantity: number;
    size_id: string;
    heavy_id: string;
  }[];
}
