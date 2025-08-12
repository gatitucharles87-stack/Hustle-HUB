"use client";

import { useState, useEffect } from "react";
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
import api from "@/lib/api"; // Import the API client
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioItem {
  id: string; // Backend will return a string ID
  title: string;
  description?: string; // Made optional to align with PortfolioPreviewModal and backend data
  file_path?: string; // Backend field for document URL
  image_url?: string; // Backend field for image URL
}

// Frontend representation, mapping backend fields
interface DisplayPortfolioItem extends PortfolioItem {
  filePath?: string; // Frontend uses filePath
  imageUrl?: string; // Frontend uses imageUrl
  type: 'image' | 'document' | 'mixed'; // Derived type for display
}

const MAX_PORTFOLIO_ITEMS = 6;
const BLANK_ITEM: DisplayPortfolioItem = { id: '', title: '', description: '', filePath: '', imageUrl: '', type: 'image' };

export default function PortfolioManagementPage() {
  const { toast } = useToast();

  const [portfolio, setPortfolio] = useState<DisplayPortfolioItem[]>([]);
  const [currentItem, setCurrentItem] = useState<DisplayPortfolioItem>(BLANK_ITEM);
  const [isEditing, setIsEditing] = useState(false);
  const [previewItem, setPreviewItem] = useState<DisplayPortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/portfolio-items/");
      const fetchedItems: PortfolioItem[] = response.data;
      const displayItems: DisplayPortfolioItem[] = fetchedItems.map(item => ({
        ...item,
        filePath: item.file_path, // Map backend file_path to frontend filePath
        imageUrl: item.image_url, // Map backend image_url to frontend imageUrl
        type: item.image_url ? (item.file_path ? 'mixed' : 'image') : (item.file_path ? 'document' : 'image'), // Default to image if neither present
      }));
      setPortfolio(displayItems);
    } catch (error) {
      console.error("Failed to fetch portfolio items:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolio items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const handleAddNewClick = () => {
    if (portfolio.length >= MAX_PORTFOLIO_ITEMS) {
      toast({ title: "Limit Reached", description: `You can only showcase up to ${MAX_PORTFOLIO_ITEMS} projects.`, variant: "destructive" });
      return;
    }
    setCurrentItem(BLANK_ITEM);
    setIsEditing(true);
  };

  const handleEditClick = (item: DisplayPortfolioItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handlePreviewClick = (item: DisplayPortfolioItem) => {
    setPreviewItem(item);
  };
  
  const handleCancel = () => {
    setCurrentItem(BLANK_ITEM);
    setIsEditing(false);
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/portfolio-items/${id}/`);
      toast({ title: "Project Removed", description: "Your project has been removed from your portfolio." });
      fetchPortfolioItems(); // Re-fetch to update the list
      if (isEditing && currentItem.id === id) {
          setIsEditing(false);
          setCurrentItem(BLANK_ITEM);
      }
    } catch (error) {
      console.error("Failed to delete portfolio item:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSave = async () => {
    if (!currentItem.title || (!currentItem.filePath && !currentItem.imageUrl)) {
        toast({ title: "Missing Information", description: "Please provide a title and upload at least one file or image.", variant: "destructive"});
        return;
    }

    const payload = {
      title: currentItem.title,
      description: currentItem.description || "", // Ensure description is always a string
      file_path: currentItem.filePath || null, // Map frontend filePath to backend file_path
      image_url: currentItem.imageUrl || null, // Map frontend imageUrl to backend image_url
    };

    try {
        if (currentItem.id) { // Updating existing item
            await api.put(`/portfolio-items/${currentItem.id}/`, payload);
            toast({ title: "Project Updated!", description: "Your portfolio has been successfully updated." });
        } else { // Adding new item
            await api.post("/portfolio-items/", payload);
            toast({ title: "Project Added!", description: "Your new project has been added to your portfolio." });
        }
        fetchPortfolioItems(); // Re-fetch to update the list
        setIsEditing(false);
        setCurrentItem(BLANK_ITEM);
    } catch (error) {
      console.error("Failed to save portfolio item:", error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'document' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      // For simplicity and given the API spec for file_path/image_url are strings (URLs),
      // we'll simulate a file upload by creating a local URL or a placeholder.
      // In a real application, this would involve uploading to a storage service (e.g., S3, Cloudinary)
      // and getting a public URL back, then sending that URL to your Django backend.
      const mockUrl = URL.createObjectURL(file); // Create a temporary URL for preview

      if (fileType === 'document') {
          setCurrentItem(prev => ({...prev, filePath: mockUrl, type: prev.imageUrl ? 'mixed' : 'document'}));
      } else {
          setCurrentItem(prev => ({...prev, imageUrl: mockUrl, type: prev.filePath ? 'mixed' : 'image'}));
      }
      toast({ title: "File Selected", description: `Selected file: ${file.name}` });
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
                    {currentItem.imageUrl && <p className="text-sm text-muted-foreground">Current image: <a href={currentItem.imageUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a></p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="documentUpload">Project Document (Optional)</Label>
                    <Input id="documentUpload" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'document')} />
                    {currentItem.filePath && <p className="text-sm text-muted-foreground">Current document: <a href={currentItem.filePath} target="_blank" rel="noopener noreferrer" className="underline">View</a></p>}
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
        <Button onClick={handleAddNewClick} className="w-fit" disabled={portfolio.length >= MAX_PORTFOLIO_ITEMS || loading}>
            <PlusCircle className="mr-2 h-4 w-4"/>
            Add New Project
        </Button>
      )}

      <Separator />

      <div>
        <h2 className="text-2xl font-bold font-headline">Your Portfolio ({portfolio.length}/{MAX_PORTFOLIO_ITEMS})</h2>
        <p className="text-muted-foreground">This is how employers will see your work. Click the eye icon to preview.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="group relative overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center rounded-t-lg">
                    <Skeleton className="h-full w-full" />
                </div>
                <div className="p-4">
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="absolute top-2 right-2 flex gap-2 p-1 rounded-md">
                     <Skeleton className="h-8 w-8" />
                     <Skeleton className="h-8 w-8" />
                     <Skeleton className="h-8 w-8" />
                </div>
            </Card>
          ))}
        </div>
      ) : portfolio.length === 0 ? (
        <Card className="text-center py-8">
            <CardTitle className="text-xl font-headline mb-2">No Portfolio Items</CardTitle>
            <CardDescription>Start by adding your first project to showcase your skills!</CardDescription>
            <Button onClick={handleAddNewClick} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add First Project
            </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map(item => (
              <Card key={item.id} className="group relative overflow-hidden">
                  <div className="h-48 bg-muted flex items-center justify-center rounded-t-lg">
                      {item.imageUrl ? 
                          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover"/> :
                          (item.filePath ? <FileText className="h-16 w-16 text-muted-foreground" /> : <ImageIcon className="h-16 w-16 text-muted-foreground" />)
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
      )}
      
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
