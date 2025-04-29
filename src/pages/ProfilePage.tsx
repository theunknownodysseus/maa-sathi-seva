
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  FileText,
  User,
  ChevronRight,
  Clock,
  AlertCircle,
  Download,
} from "lucide-react";
import { getOfflineData, storeOfflineData } from "@/utils/offlineSupport";

interface HealthRecord {
  id: string;
  date: string;
  type: string;
  doctor: string;
  notes: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  location: string;
  type: string;
  status: "upcoming" | "completed" | "canceled";
}

interface Alert {
  id: string;
  type: "info" | "warning" | "urgent";
  message: string;
  date: string;
}

const ProfilePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // In a real app, we would fetch this data from an API
    // For now, we'll use mock data stored in localStorage for offline support
    const fetchData = () => {
      const cachedRecords = getOfflineData<HealthRecord[]>("healthRecords");
      const cachedAppointments = getOfflineData<Appointment[]>("appointments");
      const cachedAlerts = getOfflineData<Alert[]>("alerts");

      if (!cachedRecords) {
        // Mock data for health records
        const mockRecords: HealthRecord[] = [
          {
            id: "1",
            date: "2023-10-15",
            type: "Prenatal Checkup",
            doctor: "Dr. Sharma",
            notes: "Normal pregnancy progression. Blood pressure: 120/80. Weight: 65kg.",
          },
          {
            id: "2",
            date: "2023-09-01",
            type: "Blood Test",
            doctor: "Dr. Patel",
            notes: "Hemoglobin: 12.5 g/dL. Glucose: 85 mg/dL. All parameters normal.",
          },
          {
            id: "3",
            date: "2023-08-10",
            type: "Ultrasound",
            doctor: "Dr. Singh",
            notes: "Fetal growth on track. Estimated gestational age: 24 weeks.",
          },
        ];
        storeOfflineData("healthRecords", mockRecords);
        setHealthRecords(mockRecords);
      } else {
        setHealthRecords(cachedRecords);
      }

      if (!cachedAppointments) {
        // Mock data for appointments
        const mockAppointments: Appointment[] = [
          {
            id: "1",
            date: "2023-11-20",
            time: "10:30 AM",
            doctor: "Dr. Sharma",
            location: "City Maternal Hospital",
            type: "Regular Checkup",
            status: "upcoming",
          },
          {
            id: "2",
            date: "2023-10-15",
            time: "9:00 AM",
            doctor: "Dr. Sharma",
            location: "City Maternal Hospital",
            type: "Prenatal Checkup",
            status: "completed",
          },
          {
            id: "3",
            date: "2023-09-01",
            time: "11:15 AM",
            doctor: "Dr. Patel",
            location: "Community Health Center",
            type: "Blood Work",
            status: "completed",
          },
        ];
        storeOfflineData("appointments", mockAppointments);
        setAppointments(mockAppointments);
      } else {
        setAppointments(cachedAppointments);
      }

      if (!cachedAlerts) {
        // Mock data for alerts
        const mockAlerts: Alert[] = [
          {
            id: "1",
            type: "info",
            message: "Your next appointment is scheduled for November 20, 2023.",
            date: "2023-11-10",
          },
          {
            id: "2",
            type: "warning",
            message: "Remember to take your prenatal vitamins daily.",
            date: "2023-11-05",
          },
          {
            id: "3",
            type: "urgent",
            message: "Please update your contact information for emergency purposes.",
            date: "2023-11-01",
          },
        ];
        storeOfflineData("alerts", mockAlerts);
        setAlerts(mockAlerts);
      } else {
        setAlerts(cachedAlerts);
      }

      setLoading(false);
    };

    fetchData();

    // Set up online/offline listeners
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const handleDownloadRecords = () => {
    try {
      const dataStr = JSON.stringify(healthRecords, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", "health-records.json");
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast({
        title: "Records downloaded",
        description: "Your health records have been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your health records.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-maternal-primary">
              Patient Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Access your health records, appointments, and personal information
            </p>
          </div>
          {isOffline && (
            <div className="mt-4 md:mt-0 px-4 py-2 bg-amber-50 text-amber-700 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Offline Mode - Limited functionality available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Next Appointment</CardTitle>
              <CardDescription>Upcoming medical visit</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.filter(a => a.status === "upcoming").length > 0 ? (
                appointments
                  .filter(a => a.status === "upcoming")
                  .slice(0, 1)
                  .map(appointment => (
                    <div key={appointment.id} className="space-y-2">
                      <div className="flex items-center text-maternal-primary font-medium">
                        <Calendar className="h-4 w-4 mr-2" />
                        {appointment.date} at {appointment.time}
                      </div>
                      <p className="text-sm">{appointment.type} with {appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.location}</p>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Health Summary</CardTitle>
              <CardDescription>Recent medical activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last checkup</span>
                  <span className="text-sm font-medium">Oct 15, 2023</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Health records</span>
                  <span className="text-sm font-medium">{healthRecords.length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current trimester</span>
                  <span className="text-sm font-medium">Second</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Alerts & Reminders</CardTitle>
              <CardDescription>Important notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.length > 0 ? (
                  alerts.slice(0, 2).map(alert => (
                    <div
                      key={alert.id}
                      className={`text-sm p-2 rounded ${
                        alert.type === "urgent"
                          ? "bg-red-50 text-red-700"
                          : alert.type === "warning"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {alert.message}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No alerts</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="records" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="records">
              <FileText className="h-4 w-4 mr-2" />
              Medical Records
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Personal Info
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="records">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Health Records</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleDownloadRecords}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Records
                  </Button>
                </div>
                <CardDescription>
                  Access your medical history and test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-6 text-center">Loading records...</div>
                ) : healthRecords.length > 0 ? (
                  <div className="space-y-4">
                    {healthRecords.map((record) => (
                      <div
                        key={record.id}
                        className="border rounded-md p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-maternal-primary mr-2" />
                            <h4 className="font-medium">{record.type}</h4>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {record.date}
                          </span>
                        </div>
                        <p className="text-sm mb-1">Doctor: {record.doctor}</p>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No health records available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Appointment History</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/appointments">Book New Appointment</a>
                  </Button>
                </div>
                <CardDescription>
                  Manage your medical appointments and visits
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-6 text-center">Loading appointments...</div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-md p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                appointment.status === "upcoming"
                                  ? "bg-green-500"
                                  : appointment.status === "completed"
                                  ? "bg-blue-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <h4 className="font-medium">{appointment.type}</h4>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === "upcoming"
                                ? "bg-green-100 text-green-700"
                                : appointment.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm mb-1">
                          <Calendar className="h-3 w-3 mr-2" />
                          {appointment.date} at {appointment.time}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-muted-foreground">
                            {appointment.doctor} • {appointment.location}
                          </div>
                          <Button variant="ghost" size="sm" className="h-8">
                            <span className="sr-only">View details</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No appointments found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </div>
                <CardDescription>
                  Manage your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Name</span>
                          <span className="col-span-2 font-medium">Priya Sharma</span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="col-span-2 font-medium">+91 98765-43210</span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Email</span>
                          <span className="col-span-2 font-medium">priya.sharma@example.com</span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Address</span>
                          <span className="col-span-2 font-medium">
                            123 Main Street, Bangalore, Karnataka
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Medical Information</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Blood Type</span>
                          <span className="col-span-2 font-medium">B+</span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Allergies</span>
                          <span className="col-span-2 font-medium">None</span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Due Date</span>
                          <span className="col-span-2 font-medium">March 15, 2024</span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-muted-foreground">Primary Doctor</span>
                          <span className="col-span-2 font-medium">Dr. Sharma, City Maternal Hospital</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Emergency Contacts</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-6 text-sm">
                        <span className="text-muted-foreground">Name</span>
                        <span className="col-span-2 font-medium">Rajesh Sharma</span>
                        <span className="text-muted-foreground">Relation</span>
                        <span className="col-span-2 font-medium">Husband</span>
                      </div>
                      <div className="grid grid-cols-6 text-sm">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="col-span-5 font-medium">+91 98765-12345</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
