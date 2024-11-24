import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Pencil,
  Send,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Soal } from "@/types/SoalsData";
import { useSession } from "next-auth/react";
import { useState } from "react";
import SubmitFlag from "@/components/common/SubmitFlag";

interface SoalCardProps {
  soal: Soal;
  editingId: string | null;
  editUrl: string;
  solvedSoals: string[];
  onEdit: (soal: Soal) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => Promise<void>;
  onCancel: () => void;
  onEditUrlChange: (url: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onSubmitToken: (id: string, flag: string) => Promise<boolean>;
  refetchData: () => Promise<void>;
}

export const SoalCard = ({
  soal,
  editingId,
  editUrl,
  solvedSoals,
  onEdit,
  onDelete,
  onUpdate,
  onCancel,
  onEditUrlChange,
  onToggleFavorite,
  onSubmitToken,
  refetchData,
}: SoalCardProps) => {
  const session = useSession();
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const isAdmin = session.data?.user.role === "admin";
  const isSolved = solvedSoals.includes(soal.id);
  const isEditing = editingId === soal.id;

  const formatDate = (date: string) =>
    format(new Date(date), "dd MMM yyyy HH:mm");

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    setIsDelete(true);

    try {
      onDelete(id);
      await refetchData();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setIsSaving(true);
    try {
      await onUpdate(id);
      await refetchData();
      onCancel();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-200">
      <div className="p-6 space-y-6 bg-background/50 dark:bg-secondary/50 hover:bg-background/80 dark:hover:bg-secondary/80">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold tracking-tight">
                Soal Text
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={!soal.url}
                onClick={() =>
                  soal.url &&
                  window.open(soal.url, "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-muted/50 dark:bg-muted/20 rounded-md border dark:border-muted p-4">
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {soal.soal}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {formatDate(soal.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated: {formatDate(soal.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" />
                <span>
                  Categories :{" "}
                  {soal.category
                    ? soal.category
                        .split(",")
                        .map(
                          (cat) =>
                            cat.trim().charAt(0).toUpperCase() +
                            cat.trim().slice(1)
                        )
                        .join(", ")
                    : "No Categories"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <div className="flex justify-between items-center pt-2">
            {isAdmin ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(soal)}
                  className="gap-2 hover:bg-primary hover:text-primary-foreground"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="hidden md:inline">Edit URL</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isDelete}
                  onClick={() => handleDelete(soal.id)}
                  className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDelete ? (
                    <span className="hidden md:inline">Delete...</span>
                  ) : (
                    <span className="hidden md:inline">Delete</span>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex-1" />
            )}

            <div className="flex items-center gap-2">
              {!isSolved && !isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFlagDialogOpen(true)}
                  className="gap-2 hover:bg-primary hover:text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                  Submit
                </Button>
              )}
              {!isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleFavorite(soal.id, soal.isFavorite)}
                  className={`gap-2 transition-colors ${
                    soal.isFavorite
                      ? "bg-yellow-500/10 hover:bg-yellow-500/20"
                      : "hover:bg-secondary"
                  }`}
                >
                  <Star
                    className={`h-4 w-4 ${
                      soal.isFavorite ? "text-yellow-500" : ""
                    }`}
                  />
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Edit URL Form */
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              <Input
                type="url"
                value={editUrl}
                onChange={(e) => onEditUrlChange(e.target.value)}
                placeholder="Enter new URL"
                className="flex-1 bg-background focus-visible:ring-1"
                disabled={isSaving}
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => handleUpdate(soal.id)}
                disabled={!editUrl || !validateUrl(editUrl) || isSaving}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden md:inline">
                  {isSaving ? "Saving..." : "Save"}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isSaving}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                <span className="hidden md:inline">Cancel</span>
              </Button>
            </div>
            {editUrl && !validateUrl(editUrl) && (
              <p className="text-xs text-destructive">
                Please enter a valid URL
              </p>
            )}
          </div>
        )}

        <SubmitFlag
          isOpen={flagDialogOpen}
          onOpenChange={setFlagDialogOpen}
          soalId={soal.id}
          onSubmit={onSubmitToken}
        />
      </div>
    </Card>
  );
};

export default SoalCard;
