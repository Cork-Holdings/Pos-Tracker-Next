import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ChangeEmailForm from "../../forms/users/change-email-form";

interface ChangeEmailDialogProps {
  open: boolean;
  currentEmail?: string;
  onClose: () => void;
  onUpdated?: () => void;
}

const ChangeEmailDialog: React.FC<ChangeEmailDialogProps> = ({ open, currentEmail, onClose, onUpdated }) => {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="md:min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change email</DialogTitle>
          <DialogDescription>
            This becomes the address you sign in with.
          </DialogDescription>
        </DialogHeader>
        <ChangeEmailForm
          currentEmail={currentEmail}
          onSuccess={() => {
            onUpdated?.();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ChangeEmailDialog;
