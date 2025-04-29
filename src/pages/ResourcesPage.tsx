
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, BookOpen, Video, FileText, Globe, Download, Phone, Mic } from 'lucide-react';
import { isOnline, storeOfflineData, getOfflineData } from '@/utils/offlineSupport';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Define resource types
type ResourceCategory = 'all' | 'articles' | 'videos' | 'guides' | 'schemes';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  language: string;
  url?: string;
  image?: string;
  isAvailableOffline: boolean;
  lastUpdated: string;
}

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('all');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [resources, setResources] = useState<Resource[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Load resources data
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        if (isOnline()) {
          // In a real app, this would be an API call
          const data = getMockResources();
          setResources(data);
          // Store for offline use
          storeOfflineData('resources', data);
        } else {
          // Get from offline storage
          const offlineData = getOfflineData<Resource[]>('resources');
          if (offlineData) {
            setResources(offlineData);
          }
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();

    // Load saved resources from localStorage
    const loadSavedResources = () => {
      const saved = getOfflineData<string[]>('savedResources');
      if (saved) {
        setSavedResources(saved);
      }
    };
    loadSavedResources();

    // Set up online/offline listeners
    const handleOnlineStatus = () => {
      setOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const getMockResources = (): Resource[] => {
    return [
      {
        id: '1',
        title: 'Understanding Prenatal Care',
        description: 'A comprehensive guide to prenatal care during all trimesters of pregnancy.',
        category: 'articles',
        language: 'en',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJlZ25hbmN5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailableOffline: true,
        lastUpdated: '2025-03-15'
      },
      {
        id: '2',
        title: 'गर्भावस्था में भोजन और पोषण',
        description: 'गर्भावस्था के दौरान स्वस्थ आहार और पोषण के बारे में जानकारी।',
        category: 'articles',
        language: 'hi',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aGVhbHRoeSUyMGZvb2R8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailableOffline: true,
        lastUpdated: '2025-04-10'
      },
      {
        id: '3',
        title: 'Signs of Labor - What to Expect',
        description: 'Learn about the signs that indicate you might be going into labor.',
        category: 'videos',
        language: 'en',
        image: 'https://images.unsplash.com/photo-1584908917822-6beb4a8a5e2f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGFib3J8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailableOffline: false,
        lastUpdated: '2025-03-28'
      },
      {
        id: '4',
        title: 'கர்ப்பகால உடற்பயிற்சிகள்',
        description: 'கர்ப்பகாலத்தில் பாதுகாப்பான உடற்பயிற்சிகளைப் பற்றி அறிந்து கொள்ளுங்கள்.',
        category: 'videos',
        language: 'ta',
        image: 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJlZ25hbmN5JTIwZXhlcmNpc2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailableOffline: true,
        lastUpdated: '2025-04-15'
      },
      {
        id: '5',
        title: 'Janani Suraksha Yojana (JSY) Benefits Guide',
        description: 'Complete information about JSY benefits, eligibility, and how to apply.',
        category: 'schemes',
        language: 'en',
        image: 'https://images.unsplash.com/photo-1543008695-0241ca1b3ebb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z292ZXJubWVudHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailableOffline: true,
        lastUpdated: '2025-04-20'
      },
      {
        id: '6',
        title: 'Postpartum Care Essentials',
        description: 'A guide to postpartum recovery and caring for your newborn.',
        category: 'guides',
        language: 'en',
        image: 'https://images.unsplash.com/photo-1580377968131-bbd33f8e0b8a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG9zdHBhcnR1bXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailableOffline: true,
        lastUpdated: '2025-04-05'
      },
      {
        id: '7',
        title: 'प्रधानमंत्री मातृ वंदना योजना',
        description: 'इस योजना के तहत गर्भवती महिलाओं को मिलने वाले लाभों की जानकारी।',
        category: 'schemes',
        language: 'hi',
        image: 'https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bW9uZXl8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailableOffline: true,
        lastUpdated: '2025-04-22'
      },
      {
        id: '8',
        title: 'Emergency Childbirth Procedures',
        description: 'What to do in case of an emergency childbirth situation.',
        category: 'guides',
        language: 'en',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZW1lcmdlbmN5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailableOffline: true,
        lastUpdated: '2025-04-18'
      }
    ];
  };

  const handleSaveResource = (resourceId: string) => {
    const newSavedResources = [...savedResources];
    
    if (newSavedResources.includes(resourceId)) {
      // Remove from saved list
      const index = newSavedResources.indexOf(resourceId);
      newSavedResources.splice(index, 1);
    } else {
      // Add to saved list
      newSavedResources.push(resourceId);
    }
    
    setSavedResources(newSavedResources);
    storeOfflineData('savedResources', newSavedResources);
  };

  const handleDownloadResource = (resource: Resource) => {
    // In a real app, this would download the resource for offline use
    console.log(`Downloading resource: ${resource.title}`);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const getCategoryIcon = (category: ResourceCategory) => {
    switch(category) {
      case 'articles': return <FileText className="h-5 w-5" />;
      case 'videos': return <Video className="h-5 w-5" />;
      case 'guides': return <BookOpen className="h-5 w-5" />;
      case 'schemes': return <Globe className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <PageLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-maternal-primary">Resources</h1>
          <p className="text-muted-foreground mt-2">
            Access health information, videos, and government schemes - available offline
          </p>

          {offline && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mt-4 flex items-center">
              <Phone className="h-5 w-5 text-amber-500 mr-2" />
              <p className="text-amber-800 text-sm">
                You are currently offline. Some resources may be limited.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-1">
                  {['all', 'articles', 'videos', 'guides', 'schemes'].map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "ghost"}
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setActiveCategory(category as ResourceCategory)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Language</h3>
                <div className="space-y-1">
                  <Button
                    variant={selectedLanguage === 'all' ? "default" : "ghost"}
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setSelectedLanguage('all')}
                  >
                    All Languages
                  </Button>
                  <Button
                    variant={selectedLanguage === 'en' ? "default" : "ghost"}
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setSelectedLanguage('en')}
                  >
                    🇬🇧 English
                  </Button>
                  <Button
                    variant={selectedLanguage === 'hi' ? "default" : "ghost"}
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setSelectedLanguage('hi')}
                  >
                    🇮🇳 हिन्दी (Hindi)
                  </Button>
                  <Button
                    variant={selectedLanguage === 'ta' ? "default" : "ghost"}
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setSelectedLanguage('ta')}
                  >
                    🇮🇳 தமிழ் (Tamil)
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Offline Access</h3>
                <Link to="/saved-resources">
                  <Button variant="outline" size="sm" className="w-full">
                    View Saved Resources
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maternal-primary"></div>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-4">
                  Try changing your search terms or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                    setSelectedLanguage('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="overflow-hidden">
                    {resource.image && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={resource.image}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          {getCategoryIcon(resource.category)}
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-maternal-light text-maternal-primary">
                            {resource.category}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleSaveResource(resource.id)}
                        >
                          {savedResources.includes(resource.id) ? (
                            <BookOpen className="h-4 w-4 fill-current" />
                          ) : (
                            <BookOpen className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Last updated: {resource.lastUpdated}</span>
                          <span>
                            {resource.language === 'en' && '🇬🇧 English'}
                            {resource.language === 'hi' && '🇮🇳 हिन्दी'}
                            {resource.language === 'ta' && '🇮🇳 தமிழ்'}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button className="flex-1" asChild>
                            <Link to={`/resource/${resource.id}`}>
                              View Details
                            </Link>
                          </Button>
                          {resource.isAvailableOffline && (
                            <Button 
                              variant="outline" 
                              onClick={() => handleDownloadResource(resource)}
                              className="px-3"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline"
                            className="px-3"
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResourcesPage;
