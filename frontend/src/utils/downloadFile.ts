export const downloadFile = (blob: Blob, fileName: string) => {
  const file = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = file;
  a.download = fileName;
  document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
  a.click();
  a.remove(); //afterwards we remove the element again
};
