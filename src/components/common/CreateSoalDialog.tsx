"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateSoalDialogProps {
  onSoalCreated: () => Promise<void>;
}

export const CreateSoalDialog = ({ onSoalCreated }: CreateSoalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    soal: "",
    url: "",
    flag: "",
    categories: [] as string[],
  });
  const [createStatus, setCreateStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  const availableCategories = [
    "cryptography",
    "forensics",
    "reverse",
    "network",
    "web",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateStatus({ loading: true, success: false, error: "" });

    try {
      const response = await fetch("/api/soals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: formData.categories.join(", "),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create soal");

      setCreateStatus({ loading: false, success: true, error: "" });
      await onSoalCreated();

      setFormData({ soal: "", url: "", flag: "", categories: [] });
      setIsOpen(false);
      setCreateStatus((prev) => ({ ...prev, success: false }));
    } catch (error) {
      if (error instanceof Error) {
        setCreateStatus({
          loading: false,
          success: false,
          error: error.message,
        });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category: string) => {
    setFormData((prev) => {
      if (prev.categories.includes(category)) {
        return prev;
      }
      return {
        ...prev,
        categories: [...prev.categories, category],
      };
    });
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-medium">
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Create New Soal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px] p-4">
        <DialogTitle className="text-xl font-semibold">
          Create New Soal
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="soal" className="font-medium">
              Question
            </Label>
            <Textarea
              id="soal"
              name="soal"
              value={formData.soal}
              onChange={handleChange}
              placeholder="Enter the question..."
              required
              className="min-h-32 resize-none w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="font-medium">
              URL
            </Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="Enter the URL..."
              required
              className="focus-visible:ring-2 w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="flag" className="font-medium">
              Flag
            </Label>
            <Input
              id="flag"
              name="flag"
              type="text"
              value={formData.flag}
              onChange={handleChange}
              placeholder="Enter the flag..."
              required
              className="focus-visible:ring-2 w-full"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Categories</Label>
            <Select onValueChange={handleCategorySelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select categories" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    disabled={formData.categories.includes(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                >
                  <span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {createStatus.error && (
            <Alert variant="destructive" className="rounded-lg">
              <div className="flex gap-3 items-center">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{createStatus.error}</AlertDescription>
              </div>
            </Alert>
          )}
          {createStatus.success && (
            <Alert className="rounded-lg" variant="default">
              <div className="flex gap-3 items-center">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Soal created successfully!</AlertDescription>
              </div>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full font-medium h-11"
            disabled={createStatus.loading || formData.categories.length === 0}
          >
            {createStatus.loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Soal"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
