
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Share, BookOpen, FileText, Video, Globe } from 'lucide-react';
import { getOfflineData } from '@/utils/offlineSupport';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'articles' | 'videos' | 'guides' | 'schemes' | 'all';
  language: string;
  url?: string;
  image?: string;
  content?: string;
  isAvailableOffline: boolean;
  lastUpdated: string;
}

const ResourceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        const resources = getOfflineData<Resource[]>('resources');
        if (resources) {
          const foundResource = resources.find(r => r.id === id);
          if (foundResource) {
            setResource(foundResource);
          }
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'articles': return <FileText className="h-5 w-5" />;
      case 'videos': return <Video className="h-5 w-5" />;
      case 'guides': return <BookOpen className="h-5 w-5" />;
      case 'schemes': return <Globe className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container px-4 py-8 mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maternal-primary"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!resource) {
    return (
      <PageLayout>
        <div className="container px-4 py-8 mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Resource not found</h2>
            <p className="mb-6">The resource you're looking for doesn't exist or may have been removed.</p>
            <Button asChild>
              <Link to="/resources">Back to Resources</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>

          {resource.image && (
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            <div className="flex items-center">
              {getCategoryIcon(resource.category)}
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-maternal-light text-maternal-primary">
                {resource.category}
              </span>
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              {resource.language === 'en' && '🇬🇧 English'}
              {resource.language === 'hi' && '🇮🇳 हिन्दी'}
              {resource.language === 'ta' && '🇮🇳 தமிழ்'}
            </span>
          </div>

          <h1 className="text-3xl font-bold">{resource.title}</h1>
          <p className="text-muted-foreground mt-2">Last updated: {resource.lastUpdated}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="mb-4">{resource.description}</p>
            
            {resource.content ? (
              <div className="prose dark:prose-invert max-w-none">
                {/* In a real app, this would be formatted content */}
                <p>{resource.content}</p>
              </div>
            ) : (
              <div className="bg-muted p-6 rounded-md text-center">
                <p className="text-muted-foreground">
                  This is a mock resource. In a real application, detailed content would be displayed here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          {resource.isAvailableOffline && (
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Save Offline
            </Button>
          )}
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Add to Saved
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResourceDetailPage;
