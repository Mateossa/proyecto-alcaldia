export default function Modal({ children, logo, onClose }) {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">

      <div className="relative w-82 h-30 bg-white rounded-2xl flex items-center gap-3 p-4 shadow-lg">

        {logo && (
          <div>
            {logo}
          </div>
        )}

        <p className="flex-1">{children}</p>

        <button 
          onClick={onClose}
          className="absolute top-2 right-4 text-small-text text-black/60 cursor-pointer"
        >
          X
        </button>

      </div>
    </div>
  )
}