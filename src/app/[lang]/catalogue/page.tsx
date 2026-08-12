import CatalogueClient from "../katalog/CatalogueClient";

export default async function CatalogueEnPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <CatalogueClient lang={lang} />;
}
