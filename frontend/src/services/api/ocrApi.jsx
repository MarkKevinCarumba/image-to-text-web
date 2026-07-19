const api = import.meta.env.VITE_API_ORC;

console.log("api", api);

if (!api) {
  throw new Error("No API");
}

export const convertImagesToText = async (files) => {
  const formdata = new FormData();

  files.forEach((file) => {
    formdata.append("files", file);
  });

  const response = await fetch(`${api}/ocr/convert`, {
    method: "POST",
    body: formdata,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "OCR request failed.");
  }

  return data;
};
