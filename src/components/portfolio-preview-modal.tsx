"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PortfolioItemCard } from "@/components/portfolio-item-card";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  filePath?: string;
  imageUrl?: string;
  type: 'image' | 'document' | 'mixed'; // Added 'mixed' type
}

interface PortfolioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
}

export function PortfolioPreviewModal({ isOpen, onClose, item, onEdit, onDelete }: PortfolioPreviewModalProps) {
  if (!item) return null;

  const handleEdit = () => {
    onEdit(item);
    onClose();
  };

  const handleDelete = () => {
    onDelete(item.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Employer View Preview</DialogTitle>
          <DialogDescription>
            This is how employers will see this project in your portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <PortfolioItemCard item={item} />
        </div>
        <DialogFooter className="justify-between">
          <div>
            <Button variant="outline" onClick={handleEdit}>Edit</Button>
            <Button variant="destructive" className="ml-2" onClick={handleDelete}>Delete</Button>
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
