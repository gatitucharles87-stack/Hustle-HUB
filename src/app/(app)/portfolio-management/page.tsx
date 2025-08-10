"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, Image as ImageIcon, FileText, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PortfolioPreviewModal } from "@/components/portfolio-preview-modal";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  filePath: string;
  imageUrl?: string; // Optional image URL
  type: 'image' | 'document';
}

const MAX_PORTFOLIO_ITEMS = 6;
const BLANK_ITEM: PortfolioItem = { id: '', title: '', description: '', filePath: '', imageUrl: '', type: 'image' };

export default function PortfolioManagementPage() {
  const { toast } = useToast();

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { id: 'p1', type: 'document', title: 'Case Study: SEO Strategy', filePath: 'https://www.africau.edu/images/default/sample.pdf', description: 'A detailed analysis of SEO improvements for a client.' },
    { id: 'p2', type: 'image', title: 'UI/UX Mockup for E-commerce', filePath: 'https://placehold.co/600x400/336699/FFFFFF?text=UI/UX', imageUrl: 'https://placehold.co/600x400/336699/FFFFFF?text=UI/UX', description: 'Mockups for a responsive e-commerce platform.' },
    { id: 'p3', type: 'image', title: 'Brand Logo Design', filePath: 'https://placehold.co/600x400/993366/FFFFFF?text=Logo', imageUrl: 'https://placehold.co/600x400/993366/FFFFFF?text=Logo', description: 'Modern logo design for a tech startup.' },
  ]);

  const [currentItem, setCurrentItem] = useState<PortfolioItem>(BLANK_ITEM);
  const [isEditing, setIsEditing] = useState(false);
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);

  const handleAddNewClick = () => {
    if (portfolio.length >= MAX_PORTFOLIO_ITEMS) {
      toast({ title: "Limit Reached", description: `You can only showcase up to ${MAX_PORTFOLIO_ITEMS} projects.`, variant: "destructive" });
      return;
    }
    setCurrentItem(BLANK_ITEM);
    setIsEditing(true);
  };

  const handleEditClick = (item: PortfolioItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handlePreviewClick = (item: PortfolioItem) => {
    setPreviewItem(item);
  };
  
  const handleCancel = () => {
    setCurrentItem(BLANK_ITEM);
    setIsEditing(false);
  };
  
  const handleDelete = (id: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
    if (isEditing && currentItem.id === id) {
        setIsEditing(false);
        setCurrentItem(BLANK_ITEM);
    }
    toast({ title: "Project Removed", description: "Your project has been removed from your portfolio." });
  };
  
  const handleSave = () => {
    if (!currentItem.title || (!currentItem.filePath && !currentItem.imageUrl)) {
        toast({ title: "Missing Information", description: "Please provide a title and upload at least one file or image.", variant: "destructive"});
        return;
    }
    
    if (currentItem.id) { // Updating existing item
        setPortfolio(prev => prev.map(item => item.id === currentItem.id ? currentItem : item));
        toast({ title: "Project Updated!", description: "Your portfolio has been successfully updated." });
    } else { // Adding new item
        const newItem = { ...currentItem, id: Date.now().toString() };
        setPortfolio(prev => [...prev, newItem]);
        toast({ title: "Project Added!", description: "Your new project has been added to your portfolio." });
    }

    setIsEditing(false);
    setCurrentItem(BLANK_ITEM);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'document' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      const mockFilePath = `/uploads/${file.name}`; // Placeholder path
      if (fileType === 'document') {
          setCurrentItem(prev => ({...prev, filePath: mockFilePath}));
      } else {
          setCurrentItem(prev => ({...prev, imageUrl: mockFilePath}));
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Portfolio</h1>
        <p className="text-muted-foreground">Add or edit your best 6 projects to showcase to employers.</p>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{currentItem.id ? 'Edit Project' : 'Add New Project'}</CardTitle>
            <CardDescription>Fill in the details for your project. You can upload an image, a document, or both.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" placeholder="e.g., Brand Identity for Tech Co." value={currentItem.title} onChange={(e) => setCurrentItem(prev => ({...prev, title: e.target.value}))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="imageUpload">Featured Image (Optional)</Label>
                    <Input id="imageUpload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                    {currentItem.imageUrl && <p className="text-sm text-muted-foreground">Current image: {currentItem.imageUrl.split('/').pop()}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="documentUpload">Project Document (Optional)</Label>
                    <Input id="documentUpload" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'document')} />
                    {currentItem.filePath && <p className="text-sm text-muted-foreground">Current document: {currentItem.filePath.split('/').pop()}</p>}
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Briefly describe your project..." value={currentItem.description} onChange={(e) => setCurrentItem(prev => ({...prev, description: e.target.value}))} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Project</Button>
          </CardFooter>
        </Card>
      ) : (
        <Button onClick={handleAddNewClick} className="w-fit" disabled={portfolio.length >= MAX_PORTFOLIO_ITEMS}>
            <PlusCircle className="mr-2 h-4 w-4"/>
            Add New Project
        </Button>
      )}

      <Separator />

      <div>
        <h2 className="text-2xl font-bold font-headline">Your Portfolio ({portfolio.length}/{MAX_PORTFOLIO_ITEMS})</h2>
        <p className="text-muted-foreground">This is how employers will see your work. Click the eye icon to preview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map(item => (
            <Card key={item.id} className="group relative overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center rounded-t-lg">
                    {item.imageUrl ? 
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover"/> :
                        <FileText className="h-16 w-16 text-muted-foreground" />
                    }
                </div>
                <div className="p-4">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background p-1 rounded-md">
                     <Button size="icon" variant="outline" onClick={() => handlePreviewClick(item)}><Eye className="h-4 w-4"/></Button>
                     <Button size="icon" variant="outline" onClick={() => handleEditClick(item)}><Edit className="h-4 w-4"/></Button>
                     <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4"/></Button>
                </div>
            </Card>
        ))}
      </div>
      
      <PortfolioPreviewModal 
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        item={previewItem}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
    </div>
  );
}
