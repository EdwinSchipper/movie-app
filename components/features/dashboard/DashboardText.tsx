export interface DashboardTextProps {
  heading: string
  description: string
}

export default function DashboardText({
  heading,
  description,
}: DashboardTextProps) {
  return (
    <div className="my-20">
      <h2 className="h2 mb-3 text-pretty">{heading}</h2>
      <p className="text-sm md:text-base text-fg-secondary leading-relaxed">
        {description}
      </p>
    </div>
  )
}