import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface SubmitFlagProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  soalId: string;
  onSubmit: (id: string, flag: string) => Promise<boolean>;
}

const SubmitFlag = ({
  isOpen,
  onOpenChange,
  soalId,
  onSubmit,
}: SubmitFlagProps) => {
  const [flag, setFlag] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!flag.trim()) {
      setError("Flag cannot be empty");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const success = await onSubmit(soalId, flag);
      if (success) {
        onOpenChange(false);
        setFlag("");
      } else {
        setError("Flag submission failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setError("An error occurred during submission");
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Flag</DialogTitle>
          <DialogDescription>
            Enter the flag for this challenge
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="Enter flag"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitFlag;
