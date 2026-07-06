// BentoGrid from Aceternity UI (https://ui.aceternity.com/components/bento-grid),
// adapted for Vite: no "use client" needed, local cn, dark-only glass tokens.
import { cn } from "../../lib/cn";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm transition duration-200 hover:bg-white/[0.06]",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 mb-2 font-sans font-bold text-ink">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-zinc-500">
          {description}
        </div>
      </div>
    </div>
  );
};
