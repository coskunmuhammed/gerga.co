import CatalogueClient from "./CatalogueClient";

export default async function CataloguePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <CatalogueClient lang={lang} />;
}
