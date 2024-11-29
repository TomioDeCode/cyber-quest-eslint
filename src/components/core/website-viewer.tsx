"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe } from "lucide-react";

interface WebsiteViewerProps {
  url: string;
  title?: string;
}

export default function WebsiteViewer({
  url,
  title = "Website Preview",
}: WebsiteViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Globe className="h-4 w-4" />
        Website
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <iframe
              src={url}
              className="w-full min-h-[60vh] border-none"
              title={title}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
