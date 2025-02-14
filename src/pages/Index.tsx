
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Paintbrush, Image } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Comic Creator Studio
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Transform your stories into stunning comic books with our powerful creation tools
        </p>
        <Button asChild size="lg" className="mr-4">
          <Link to="/create">Start Creating</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/gallery">View Gallery</Link>
        </Button>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="w-6 h-6" />
                Character Creation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Design unique characters with our intuitive character creation tools. Customize appearances, personalities, and backstories.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Story Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Craft engaging narratives with our story development tools. Create compelling plot lines and dialogue.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-6 h-6" />
                Panel Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate stunning comic panels with AI assistance. Bring your stories to life with beautiful artwork.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Create Your Comic?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our creative community and start bringing your stories to life today.
        </p>
        <Button asChild size="lg">
          <Link to="/create">Get Started Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
