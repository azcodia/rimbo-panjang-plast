import Tabs, { TabItem } from "@/components/tabs/Tabs";
import { Palette, User, Weight } from "lucide-react";
import dynamic from "next/dynamic";

export default function GroupingPage() {
  const ColorContent = dynamic(() =>
    import("@/components/tabs/content/color/color").then(
      (mod) => mod.ColorContent
    )
  );

  const SizeContent = dynamic(() =>
    import("@/components/tabs/content/size/size").then((mod) => mod.SizeContent)
  );

  const HeavyContent = dynamic(() =>
    import("@/components/tabs/content/heavy/heavy").then(
      (mod) => mod.HeavyContent
    )
  );

  const tabs: TabItem[] = [
    {
      id: "color",
      label: "Warna",
      icon: <Palette size={18} strokeWidth={2} />,
      content: <ColorContent />,
    },
    {
      id: "size",
      label: "Ukuran",
      icon: <User size={18} strokeWidth={2} />,
      content: <SizeContent />,
    },
    {
      id: "heavy",
      label: "Berat",
      icon: <Weight size={18} strokeWidth={2} />,
      content: <HeavyContent />,
    },
  ];

  return (
    <div>
      <div className="py-4 px-6 bg-white rounded-lg">
        <Tabs tabs={tabs} defaultTabId="home" />
      </div>
    </div>
  );
}
