"use client";

import StockCascadingDropdown from "@/components/stock/StockCascadingDropdown";
import Input from "@/components/ui/Input";
import { ChevronDown, Trash2 } from "lucide-react";

interface ReStockItemFormProps {
  item: any;
  index: number;
  openIndex: number | null;
  setOpenIndex: (idx: number | null) => void;
  remove: (idx: number) => void;
  stocks: any[];
  colorMap: Record<string, string>;
  sizeMap: Record<string, string>;
  heavyMap: Record<string, string>;
  setFieldValue: (field: string, value: any) => void;
  itemsLength: number;
}

export default function ReStockItemForm({
  item,
  index,
  openIndex,
  setOpenIndex,
  remove,
  stocks,
  colorMap,
  sizeMap,
  heavyMap,
  setFieldValue,
  itemsLength,
}: ReStockItemFormProps) {
  const stock = stocks.find(
    (s) =>
      s.color_id === item.colorId &&
      s.size_id === item.sizeId &&
      s.heavy_id === item.heavyId
  );
  const maxStock = stock ? stock.quantity : 0;

  return (
    <div className="border rounded">
      <div
        className="p-4 flex justify-between items-center cursor-pointer bg-grayd"
        onClick={() => setOpenIndex(openIndex === index ? null : index)}
      >
        <div className="flex flex-col">
          <h4 className="font-semibold mb-1">Item {index + 1}</h4>
          <div className="flex flex-wrap gap-4 text-sm text-[#1f1f1f]">
            <span>
              <span className="font-medium">Color:</span>{" "}
              {colorMap[item.colorId] || "-"}
            </span>
            <span>
              <span className="font-medium">Size:</span>{" "}
              {`${sizeMap[item.sizeId] || "-"} cm`}
            </span>
            <span>
              <span className="font-medium">Heavy:</span>{" "}
              {heavyMap[item.heavyId] ? `${heavyMap[item.heavyId]} gram` : "-"}
            </span>
            <span>
              <span className="font-medium">Qty:</span> {item.quantity || "0"}
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-2.5 items-center">
          {itemsLength > 1 && (
            <Trash2
              size={22.5}
              strokeWidth={2.5}
              className="font-bold p-1 border-danger border rounded-md text-danger hover:border-danger-light hover:text-danger-light"
              onClick={() => {
                remove(index);
                if (openIndex === index) setOpenIndex(null);
                else if (openIndex && openIndex > index)
                  setOpenIndex(openIndex - 1);
              }}
            />
          )}
          <ChevronDown
            strokeWidth={2.5}
            size={22.5}
            className={`text-xl font-bold p-1 border-success border rounded-md text-success hover:border-success-light hover:text-succes-light transition-transform duration-200 ${
              openIndex === index ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          openIndex === index ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="p-4 flex flex-col gap-3">
          <StockCascadingDropdown
            value={{
              colorId: item.colorId,
              sizeId: item.sizeId,
              heavyId: item.heavyId,
            }}
            onChange={(vals) => {
              setFieldValue(`items.${index}.colorId`, vals.colorId);
              setFieldValue(`items.${index}.sizeId`, vals.sizeId);
              setFieldValue(`items.${index}.heavyId`, vals.heavyId);
            }}
          />

          <Input
            label="Quantity"
            type="number"
            placeholder="Enter quantity"
            value={item.quantity}
            onChange={(val) => setFieldValue(`items.${index}.quantity`, val)}
          />
        </div>
      </div>
    </div>
  );
}
