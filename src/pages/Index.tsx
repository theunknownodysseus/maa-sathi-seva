
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Calendar, MessageSquare, FileText, Loader2, Phone, MicOff, Info } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { registerServiceWorker } from "@/utils/offlineSupport";
import VoiceSupport from "@/components/VoiceSupport";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [showVoiceSupport, setShowVoiceSupport] = useState(false);

  useEffect(() => {
    // Register service worker for offline support
    registerServiceWorker();

    // Set up online/offline listeners
    const handleOnlineStatus = () => {
      setOffline(!navigator.onLine);
      if (navigator.onLine) {
        toast({
          title: "You're back online",
          description: "All features are now available.",
        });
      } else {
        toast({
          title: "You're offline",
          description: "Some features may be limited.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      clearTimeout(timer);
    };
  }, [toast]);

  const handleVoiceResult = (text: string) => {
    console.log("Voice input:", text);
    // Logic to process voice commands would go here
    // For example:
    if (text.toLowerCase().includes("emergency") || text.toLowerCase().includes("help")) {
      toast({
        title: "Emergency Detected",
        description: "Redirecting to emergency services...",
        variant: "destructive",
      });
      // setTimeout(() => navigate('/emergency'), 2000);
    } else if (text.toLowerCase().includes("appointment") || text.toLowerCase().includes("book")) {
      toast({
        description: "Would you like to book an appointment?",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-maternal-primary" />
          <h2 className="mt-4 text-xl font-medium">Loading Maa Sathi Seva...</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your maternal health companion
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-maternal-light to-white dark:from-maternal-dark dark:to-slate-900 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col space-y-4">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-maternal-primary">
                Your Complete Maternal Healthcare Companion
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Access healthcare support, track your pregnancy journey, and connect with healthcare providers - even with limited connectivity.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button size="lg" asChild>
                  <Link to="/profile">
                    Get Started
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/chat">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Chat with Support
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceSupport(!showVoiceSupport)}
                  className="flex items-center text-sm"
                >
                  {showVoiceSupport ? (
                    <>
                      <MicOff className="mr-1 h-4 w-4" />
                      Hide Voice Support
                    </>
                  ) : (
                    <>
                      <Phone className="mr-1 h-4 w-4" />
                      Try Voice Support
                    </>
                  )}
                </Button>
                
                {offline && (
                  <div className="ml-4 flex items-center text-sm text-amber-600 dark:text-amber-400">
                    <Info className="h-4 w-4 mr-1" />
                    Offline Mode
                  </div>
                )}
              </div>
              
              {showVoiceSupport && (
                <div className="mt-2">
                  <VoiceSupport 
                    onSpeechResult={handleVoiceResult} 
                    language="en-US"
                  />
                </div>
              )}
            </div>
            
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-maternal-primary/10 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Mother and child"
                className="rounded-2xl object-cover w-full h-full max-h-[500px] relative z-10"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-maternal-dark dark:text-maternal-light">
              Key Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tools and resources to support your maternal health journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-maternal-light shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-maternal-primary/10 flex items-center justify-center mb-2">
                  <Calendar className="h-6 w-6 text-maternal-primary" />
                </div>
                <CardTitle>Appointment Scheduling</CardTitle>
                <CardDescription>Book and manage doctor appointments even with limited connectivity.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Schedule appointments, receive reminders, and get directions to healthcare centers near you.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/appointments">Book Appointment</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-maternal-light shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-maternal-primary/10 flex items-center justify-center mb-2">
                  <MessageSquare className="h-6 w-6 text-maternal-primary" />
                </div>
                <CardTitle>AI Health Assistant</CardTitle>
                <CardDescription>Get answers to health queries in your preferred language.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Ask questions about pregnancy, maternal health, nutrition, and government schemes via text or voice.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/chat">Chat Now</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-maternal-light shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-maternal-primary/10 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-maternal-primary" />
                </div>
                <CardTitle>Health Records</CardTitle>
                <CardDescription>Securely store and access your health information.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Keep track of your medical history, test results, and doctor's recommendations in one secure place.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/profile">View Records</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-maternal-light shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-maternal-primary/10 flex items-center justify-center mb-2">
                  <Bell className="h-6 w-6 text-maternal-primary" />
                </div>
                <CardTitle>Health Reminders</CardTitle>
                <CardDescription>Never miss important health checkups and medication.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Set up customized alerts for prenatal checkups, vaccinations, and medication schedules.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/reminders">Set Reminders</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-maternal-light shadow-sm sm:col-span-2 lg:col-span-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-maternal-primary/10 flex items-center justify-center mb-2">
                  <Phone className="h-6 w-6 text-maternal-primary" />
                </div>
                <CardTitle>Emergency Assistance</CardTitle>
                <CardDescription>Quick access to emergency services and contacts.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Connect with emergency services quickly, access emergency protocols, and contact your designated healthcare provider.</p>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" size="sm" className="w-full" asChild>
                  <Link to="/emergency">Emergency Support</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-maternal-light dark:bg-maternal-dark text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-maternal-dark dark:text-maternal-light">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-[700px] mx-auto">
            Create your profile to access personalized maternal healthcare support and resources.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link to="/profile">Create Your Profile</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
