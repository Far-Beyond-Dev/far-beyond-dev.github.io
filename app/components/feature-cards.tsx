import { cn } from "../components/lib/utils";
import {
  IconPaint,
  IconPuzzle,
  IconTerminal2,
  IconServer,
  IconRocket,
  IconBook,
  IconCube,
  IconHome,
  IconCloud,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Scalable",
      description:
      "Spread your players accross multiple instances of Horizon, or for Enterprise customers accross multiple physical servers.",
      icon: <IconCube />,
    },
    {
      title: "Modular",
      description:
        "Dig into the free library of official, and community-created SubSystems for use in your game!",
        icon: <IconPuzzle />,
    },
    {
      title: "Customizable",
      description:
        "Horizon is 100% open source, allowing you to add anything your game may need to it.",
        icon: <IconPaint />,
    },
    {
      title: "Fault Tolerant",
      description:
        "Any unresponsive or degraded instances are discarded and reloaded, all while seemlessly transfering player to other instances.",
        icon: <IconServer />,
    },
    {
      title: "High Performance",
      description:
        "Our software is written for maximum efficiency using mere kilobytes of memory per active player, allowing for thousands of players per instance.",
        icon: <IconRocket />,
    },
    {
      title: "Stable",
      description:
        "Horizon and it's modules are written predominently in Rust, this means that runtime errors are extremely rare to encounter once deployed.",
        icon: <IconHome />,
    },
    {
      title: "Quick Deploy",
      description:
        "Use our Horizon Launchpad tool to quick-deploy a compiled Horizon binary to your servers in seconds over SSH.",
        icon: <IconCloud />,
    },
    {
      title: "Well-Documanted",
      description:
        "The internal team at Far Beyond, and the community maintain understandable, wel-reitten documentation on nearly every aspect of Horizon including tutorials.",
        icon: <IconBook />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

export default FeaturesSectionDemo