import { AuthForm } from './AuthForm';

interface MobileAuthBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const MobileAuthBottomSheet = ({
  isOpen,
  onClose,
  title
}: MobileAuthBottomSheetProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Glassmorphic White Bottom Sheet */}
      <div className="relative z-10 w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-t-3xl border-t border-slate-200 p-5 shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Grab bar */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

        <AuthForm
          title={title}
          onSuccess={onClose}
        />

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 text-center cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
