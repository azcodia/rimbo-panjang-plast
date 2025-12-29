import LoadingSpinner from "../LoadingSpinner";

interface SummaryCardProps {
  title: string;
  value: number | string | undefined;
  subtitle?: string;
  loading?: boolean;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  loading,
}: SummaryCardProps) {
  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      {loading ? (
        <div className="flex justify-center items-center h-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="mt-1">
            <p className="text-xl font-bold">{value ?? "-"}</p>

            {subtitle && (
              <p className="text-[10px] text-success font-bold">{subtitle}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
