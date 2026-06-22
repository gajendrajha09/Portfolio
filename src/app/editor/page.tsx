import { getSiteData } from "@/lib/site-data";
import { isAuthenticated } from "@/lib/auth";
import { EditorLogin } from "@/components/EditorLogin";
import { EditorDashboard } from "@/components/EditorDashboard";

export const metadata = {
  title: "Editor | Portfolio",
  robots: "noindex, nofollow",
};

export default async function EditorPage() {
  const authenticated = await isAuthenticated();
  const data = await getSiteData();

  if (!authenticated) {
    return <EditorLogin />;
  }

  return <EditorDashboard initialData={data} />;
}
