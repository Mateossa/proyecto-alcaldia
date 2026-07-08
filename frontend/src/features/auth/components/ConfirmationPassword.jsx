import { Button, Input, Modal } from "@/shared/components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Check } from "lucide-react";

export default function ConfirmationPassword() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  const handleClick = () => {
    setModal(true);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 text-center w-full">
      <div className="w-90 relative justify-items-center bg-white shadow-2xl h-60 p-2 rounded-lg grid gap-2 font-main py-4">
        <h3 className="text-info-general font-extrabold text-brand-hover">
          Actualizar contraseña
        </h3>

        <div className="flex flex-col gap-4 w-full px-4">
          <Input type="password" placeholder="Nueva contraseña" />

          <Input type="password" placeholder="Confirmar contraseña" />
        </div>

        <Button onClick={handleClick}>Confirmar</Button>
        {modal && (
          <div className="flex mx-auto">
            <Modal
              onClose={() => navigate("/login")}
              className="font-secondary text-brand-fort"
              logo={<Check className="stroke-brand-hover" />}
            >
              Actualizacion de contraseña exitosa.
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}
