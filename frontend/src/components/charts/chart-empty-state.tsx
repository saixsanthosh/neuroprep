export function ChartEmptyState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
      <div className="max-w-sm">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{message}</p>
      </div>
    </div>
  )
}
