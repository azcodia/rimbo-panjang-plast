"use client";

import TopCustomers from "./TopCustomerss";
import TopProducts from "./TopProducts";

export default function TopHighlights() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TopProducts />
      <TopCustomers />
    </div>
  );
}
