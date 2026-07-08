import { Loader } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function Loading(){

    const navigate = useNavigate();

        setTimeout(() => {
            navigate('/validationPassword')
        }, 3000)

    return(
        <div className="absolute">
                <Loader className="flex items-center h-24 w-24 stroke-brand-hover/50 animate-spin [animation-duration:3s]"/>
        </div>
    )
}