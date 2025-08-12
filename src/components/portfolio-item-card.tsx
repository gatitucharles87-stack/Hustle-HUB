"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, FileText, ExternalLink } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  filePath?: string; // Made optional
  type: 'image' | 'document' | 'mixed'; // Added 'mixed' type
}

interface PortfolioItemCardProps {
  item: PortfolioItem;
}

export function PortfolioItemCard({ item }: PortfolioItemCardProps) {
    const Icon = item.type === 'image' ? ImageIcon : FileText;

    const handleViewClick = () => {
        // In a real app, this would open the actual file. For now, it's a placeholder.
        if (item.filePath) {
            window.open(item.filePath, '_blank');
        } else {
            // Handle case where filePath is undefined, perhaps show a toast or log
            console.warn("No file path available for this portfolio item.");
        }
    };
    
    return (
        <Card className="h-full flex flex-col">
            <CardContent className="p-4 flex-grow flex flex-col">
                 <div className="h-48 bg-muted rounded-md flex items-center justify-center mb-4">
                    <Icon className="h-16 w-16 text-muted-foreground" />
                 </div>
                <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground flex-grow mb-4">{item.description}</p>
                <Button variant="link" className="p-0 h-auto self-start" onClick={handleViewClick} disabled={!item.filePath}> {/* Disable if no filePath */}
                    View Project
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
}
