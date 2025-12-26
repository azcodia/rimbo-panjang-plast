import InStockTable from "./InStock";
import LowStock from "./LowStock";

export default function Inventory() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InStockTable />
      <LowStock />
    </div>
  );
}
