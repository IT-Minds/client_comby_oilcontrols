export async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
  const data = await fetch(url);

  const buf = await data.arrayBuffer();
  return new File([buf], filename, { type: mimeType });
}
