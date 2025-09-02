import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Music, ArrowRight } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Check sessionStorage instead of localStorage
    setIsLoggedIn(!!sessionStorage.getItem("accessToken"));
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // ✅ If logged in → redirect to localhost:3000
      window.location.href = "http://localhost:3000";
    } else {
      // ✅ If not logged in → navigate to register page
      navigate("/register");
    }
  };

  const features = [
    {
      title: "AI-Powered Music Generation",
      description:
        "Create unique tracks with our advanced AI technology that understands musical theory and patterns.",
    },
    {
      title: "Multiple Genres",
      description:
        "Generate music across dozens of genres from classical to EDM, hip-hop to ambient soundscapes.",
    },
    {
      title: "Custom Parameters",
      description:
        "Control tempo, key, mood, and instrumentation to create the perfect sound for your project.",
    },
    {
      title: "Export Options",
      description:
        "Download your creations in multiple formats including MP3, WAV, and MIDI for further editing.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 mb-8">
                <div className="flex gap-1">
                  <div className="music-wave h-3 animate-wave-1"></div>
                  <div className="music-wave h-5 animate-wave-2"></div>
                  <div className="music-wave h-4 animate-wave-3"></div>
                  <div className="music-wave h-6 animate-wave-4"></div>
                </div>
                <span className="text-base md:text-lg font-medium text-music-purple">
                  AI-Powered Music Creation
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight">
                Create Amazing Music With
                <span className="bg-clip-text text-transparent hero-gradient">
                  {" "}
                  AI Technology
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10">
                Generate original music in seconds using our advanced AI. Perfect for content creators,
                game developers, filmmakers, and music enthusiasts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-music-purple hover:bg-music-purple/90 font-medium px-8 py-6 text-base md:text-lg"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Right-side card */}
            <div className="flex-1 w-full max-w-lg">
              <div className="relative group">
                {/* Glowing animated border */}
                <div className="absolute -inset-1 rounded-xl pointer-events-none z-0 animate-pulse-glow bg-gradient-to-r from-music-purple via-purple-500 to-music-blue blur-lg opacity-80 group-hover:opacity-100 transition" />
                {/* Card content */}
                <div className="relative bg-background rounded-lg shadow-lg p-6 md:p-8 z-10">
                  <div className="flex gap-2 items-center mb-6">
                    <Music className="h-6 w-6 text-music-purple" />
                    <h3 className="text-xl md:text-2xl font-semibold">Try it now</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-muted/60 rounded-lg p-4 h-32 flex items-center justify-center">
                      <p className="text-muted-foreground text-center text-sm md:text-base">
                        AI-generated music visualizer would appear here
                      </p>
                    </div>
                    <Button
                      className="w-full bg-music-purple hover:bg-music-purple/90 py-4 text-base md:text-lg"
                      onClick={handleGetStarted}
                    >
                      Generate Track
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/40">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Powerful Music Generation Features
            </h2>
            <p className="text-muted-foreground text-base md:text-lg lg:text-xl">
              Our AI understands musical structures, harmonies, and rhythms to create original compositions
              that sound human-made.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-music-purple/10 flex items-center justify-center mb-4">
                    <Music className="h-6 w-6 text-music-purple" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-music-dark text-white py-10">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 flex items-center justify-center bg-music-purple rounded-md">
                  <Music size={18} />
                </div>
                <span className="text-lg font-bold text-black">Music generator</span>
              </div>
              <p className="text-black/70 text-sm lg:text-base leading-relaxed">
                AI-powered music generation platform for creators. Create original tracks in seconds.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: "Product", links: ["Features", "Testimonials", "API"] },
                { title: "Resources", links: ["Documentation", "Tutorials", "Blog"] },
                { title: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
              ].map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-medium text-sm mb-2">{section.title}</h4>
                  <ul className="space-y-1">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href="#"
                          className="text-black/70 hover:text-blue-500 transition-colors text-sm lg:text-base"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-black/60 text-sm lg:text-base">
              © 2025 Music generator. All rights reserved.
            </p>
            <div className="flex gap-3 mt-3 md:mt-0">{/* Social icons if needed */}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
