import { useState } from "react";
import { Button, Input } from "@/shared/components";

export default function PasswordForm({
  buttonText = "Confirmar",
  onSubmit,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");

    onSubmit(password);
  };

  return (
    <div className="flex flex-col gap-4 w-full px-4">
      <Input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <Button onClick={handleSubmit}>
        {buttonText}
      </Button>
    </div>
  );
}
