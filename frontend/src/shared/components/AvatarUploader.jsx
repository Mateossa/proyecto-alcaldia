import FileInput from "./FileInput";

//
export default function AvatarUploader({ onUpload, label, currentImage }) {
  return (
    <FileInput
      // Etiqueta mostrada al usuario
      label={label}
      // Tipos de archivo permitidos (PNG y JPEG)
      accept="image/png, image/jpeg"
      // Callback que propaga el archivo seleccionado al componente padre
      onUpload={onUpload}
      currentImage={currentImage}
    />
  );
}
