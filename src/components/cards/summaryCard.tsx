interface SummaryCardProps {
  title: string;
  value: number | string | undefined;
  subtitle?: string;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
}: SummaryCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="mt-1 ml-2">
        <p className="text-xl font-bold">{value ?? "-"}</p>

        {subtitle && (
          <p className="text-[10px] text-success font-bold">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
