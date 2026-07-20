export const getFileObjFromBuffer = (response) => {
  const blob = new Blob([response]);
  return {
    url: window.URL.createObjectURL(blob),
    size: blob.size
  };
};
