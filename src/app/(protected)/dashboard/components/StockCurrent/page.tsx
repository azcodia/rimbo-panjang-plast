"use client";

import StockCurrentRight from "./StockCurrentRight";
import StockCurrentTable from "./StockCurrentTable";

export default function StockCurrent() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StockCurrentTable />
      <StockCurrentRight />
    </div>
  );
}
