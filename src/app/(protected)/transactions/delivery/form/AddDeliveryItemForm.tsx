"use client";

import StockCascadingDropdown from "@/components/stock/StockCascadingDropdown";
import CurrencyInput from "@/components/ui/CurrencyInput";
import ThousandInput from "@/components/ui/ThousandInput";
import { formatNumber } from "@/lib/formatNumber";
import { formatRp } from "@/lib/formatRp";
import { ChevronDown, Trash2 } from "lucide-react";

interface AddDeliveryItemFormProps {
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

export default function AddDeliveryItemForm({
  item,
  index,
  openIndex,
  setOpenIndex,
  remove,
  colorMap,
  sizeMap,
  heavyMap,
  setFieldValue,
  itemsLength,
}: AddDeliveryItemFormProps) {
  const totalPrice =
    (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) -
    (Number(item.discount) || 0);

  return (
    <div className="border rounded">
      {/* Header */}
      <div
        className="p-4 flex justify-between items-center cursor-pointer bg-grayd"
        onClick={() => setOpenIndex(openIndex === index ? null : index)}
      >
        <div className="flex flex-col">
          <h4 className="font-semibold mb-1">Item {index + 1}</h4>
          <div className="flex flex-wrap gap-4 text-sm text-[#1f1f1f]">
            <span>
              <span className="font-medium">Warna:</span>{" "}
              {colorMap[item.colorId] || "-"}
            </span>
            <span>
              <span className="font-medium">Ukuran:</span>{" "}
              {`${sizeMap[item.sizeId] || "-"} cm`}
            </span>
            <span>
              <span className="font-medium">Berat:</span>{" "}
              {heavyMap[item.heavyId]
                ? `${formatNumber(heavyMap[item.heavyId])} gram`
                : "-"}
            </span>
            <span>
              <span className="font-medium">Qty:</span>{" "}
              {formatNumber(item.quantity) || 0}
            </span>
            <span>
              <span className="font-medium">harga satuan:</span>{" "}
              {formatRp(item.unitPrice) || 0}
            </span>
            <span>
              <span className="font-medium">Diskon</span>{" "}
              {formatRp(item.discount) || 0}
            </span>
            <span>
              <span className="font-medium">Total Harga:</span>{" "}
              {formatRp(totalPrice)}
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
          <div className={`border-success border rounded-md`}>
            <ChevronDown
              strokeWidth={2.5}
              size={22.5}
              className={`text-xl font-bold p-1 text-success hover:border-success-light hover:text-succes-light transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          openIndex === index ? "max-h-[1000px]" : "max-h-0"
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

          <ThousandInput
            label="Quantity"
            placeholder="Enter quantity"
            value={item.quantity}
            onChange={(val) =>
              setFieldValue(
                `items.${index}.quantity`,
                val === "" ? "" : Number(val)
              )
            }
          />

          <CurrencyInput
            label="Harga Satuan"
            placeholder="Isi Harga Satuan"
            value={item.unitPrice}
            onChange={(val) =>
              setFieldValue(
                `items.${index}.unitPrice`,
                val === "" ? "" : Number(val)
              )
            }
          />

          <CurrencyInput
            label="Potongan Harga"
            placeholder="Enter discount"
            value={item.discount}
            onChange={(val) =>
              setFieldValue(
                `items.${index}.discount`,
                val === "" ? 0 : Number(val)
              )
            }
          />

          <CurrencyInput
            label="Total Harga"
            placeholder="Total Price"
            value={totalPrice}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
