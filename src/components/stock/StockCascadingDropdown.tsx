"use client";

import React, { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { useStockContext } from "@/context/StockContext";

interface StockCascadingDropdownProps {
  value: {
    colorId: string;
    sizeId: string;
    heavyId: string;
  };
  onChange: (val: { colorId: string; sizeId: string; heavyId: string }) => void;
}

interface Option {
  value: string;
  label: string;
}

export default function StockCascadingDropdown({
  value,
  onChange,
}: StockCascadingDropdownProps) {
  const { allData: stocks } = useStockContext();
  const [colors, setColors] = useState<Option[]>([]);
  const [sizes, setSizes] = useState<Option[]>([]);
  const [heavies, setHeavies] = useState<Option[]>([]);
  const [currentStock, setCurrentStock] = useState<number>(0);

  useEffect(() => {
    const uniqueColors = Array.from(
      new Map(
        stocks
          .filter((s) => s.color)
          .map((s) => [s.color_id, { value: s.color_id, label: s.color! }])
      ).values()
    );
    setColors(uniqueColors);
  }, [stocks]);

  useEffect(() => {
    if (!value.colorId) {
      setSizes([]);
      setHeavies([]);
      onChange({ colorId: "", sizeId: "", heavyId: "" });
      return;
    }

    const filteredSizes = stocks
      .filter((s) => s.color_id === value.colorId && s.size !== undefined)
      .map((s) => ({ value: s.size_id, label: s.size!.toString() }));

    const uniqueSizes = Array.from(
      new Map(filteredSizes.map((s) => [s.value, s])).values()
    );

    setSizes(uniqueSizes);

    if (!uniqueSizes.find((s) => s.value === value.sizeId)) {
      onChange({ ...value, sizeId: "", heavyId: "" });
      setHeavies([]);
    }
  }, [value.colorId, stocks]);

  useEffect(() => {
    if (!value.colorId || !value.sizeId) {
      setHeavies([]);
      onChange({ ...value, heavyId: "" });
      return;
    }

    const filteredHeavies = stocks
      .filter((s) => s.color_id === value.colorId && s.size_id === value.sizeId)
      .map((s) => ({ value: s.heavy_id, label: `${s.heavy} g` }));

    const uniqueHeavies = Array.from(
      new Map(filteredHeavies.map((h) => [h.value, h])).values()
    );

    setHeavies(uniqueHeavies);

    if (!uniqueHeavies.find((h) => h.value === value.heavyId)) {
      onChange({ ...value, heavyId: "" });
    }
  }, [value.colorId, value.sizeId, stocks]);

  useEffect(() => {
    if (!value.colorId || !value.sizeId || !value.heavyId) {
      setCurrentStock(0);
      return;
    }

    const stock = stocks.find(
      (s) =>
        s.color_id === value.colorId &&
        s.size_id === value.sizeId &&
        s.heavy_id === value.heavyId
    );

    setCurrentStock(stock ? stock.quantity : 0);
  }, [value.colorId, value.sizeId, value.heavyId, stocks]);

  return (
    <div className="flex flex-col gap-2">
      <Select
        label="Color"
        value={value.colorId}
        onChange={(val) => onChange({ colorId: val, sizeId: "", heavyId: "" })}
        options={colors}
      />

      <Select
        label="Size"
        value={value.sizeId}
        onChange={(val) => onChange({ ...value, sizeId: val, heavyId: "" })}
        options={sizes}
        disabled={!value.colorId || sizes.length === 0}
      />

      <Select
        label="Heavy"
        value={value.heavyId}
        onChange={(val) => onChange({ ...value, heavyId: val })}
        options={heavies}
        disabled={!value.sizeId || heavies.length === 0}
      />

      <Input
        label="Stock Saat Ini"
        value={currentStock.toString()}
        onChange={() => undefined}
        disabled={true}
      />
    </div>
  );
}
