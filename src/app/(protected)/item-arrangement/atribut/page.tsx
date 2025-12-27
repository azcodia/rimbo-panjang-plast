import PageContainer from "@/components/PageContainer";
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
    <PageContainer title="Manajemen Variabel Produk">
      <Tabs tabs={tabs} defaultTabId="color" />
    </PageContainer>
  );
}
