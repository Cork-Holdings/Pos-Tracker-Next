import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ChangePasswordForm from "../../forms/users/change-password-form";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="md:min-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            You will keep using the same email to sign in.
          </DialogDescription>
        </DialogHeader>
        <ChangePasswordForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordDialog;
