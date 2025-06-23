import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";

type UserData = {
  name: string;
  email: string;
  avatarUrl?: string;
  plan?: string;
  tracksCreated?: number;
  joined?: string;
};

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setUserData(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUserData(data);
        setLoading(false);
      })
      .catch(() => {
        setUserData(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Navbar />
        <div>Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Navbar />
        <div>User not found or not logged in.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container py-28 px-4 mx-auto">
        {/* User Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData.avatarUrl || ""} />
              <AvatarFallback className="bg-music-purple text-white text-3xl">
                {userData.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3 text-center md:text-left">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-muted px-3 py-1 rounded-full text-sm">
                  {userData.plan || "Free"} Plan
                </div>
                <div className="text-muted-foreground text-sm">
                  {userData.tracksCreated || 0} tracks created
                </div>
                <div className="text-muted-foreground text-sm">
                  Member since {userData.joined || "2025"}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="flex gap-2">
              <Settings className="h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>My Music</CardTitle>
          </CardHeader>
          <CardContent className="py-10 text-center">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Welcome, {userData.name}!</h3>
            <p className="text-muted-foreground mb-6">
              In a real application, this would show the user's created music tracks,
              favorites, and account settings.
            </p>
            <Button className="bg-music-purple hover:bg-music-purple/90">
              Create Sample Track
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;