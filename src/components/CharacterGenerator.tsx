import React, { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { RunwareService } from '@/services/runware';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const CharacterGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [description, setDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seed, setSeed] = useState<number | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGeneration = async () => {
    if (!apiKey) {
      toast.error('Please enter your Runware API key');
      return;
    }

    if (!description && !referenceImage) {
      toast.error('Please provide either a description or a reference image');
      return;
    }

    setIsGenerating(true);
    const runwareService = new RunwareService(apiKey);

    try {
      let prompt = description;
      if (referenceImage) {
        prompt = `Transform this reference image into a comic book style character. ${description ? 'Additional details: ' + description : ''}`;
      } else {
        prompt = `Create a comic book style character: ${description}. Highly detailed, professional comic art style, full body shot, clean lines, vibrant colors.`;
      }
      
      const result = await runwareService.generateImage({
        positivePrompt: prompt,
        seed: seed,
        CFGScale: 7,
        numberResults: 1,
        // If we have a reference image, we could use it here with the image-to-image endpoint
        // This would require additional implementation in the RunwareService
      });

      setGeneratedImage(result.imageURL);
      setSeed(result.seed);
      toast.success('Character generated successfully!');
    } catch (error) {
      toast.error('Failed to generate character. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateWithSeed = async () => {
    if (seed) {
      await handleImageGeneration();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Comic Character Generator</h1>
        
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2">Runware API Key</Label>
            <Input
              type="password"
              placeholder="Enter your Runware API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Text Description</TabsTrigger>
              <TabsTrigger value="image">Reference Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              <div className="space-y-2">
                <Label>Character Description</Label>
                <Textarea
                  placeholder="Describe your character (e.g., 'a brave young girl with curly red hair and glasses')"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="image">
              <div className="space-y-2">
                <Label>Upload Reference Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {referenceImage && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Reference Image Preview:</p>
                    <img 
                      src={referenceImage} 
                      alt="Reference" 
                      className="max-h-[200px] rounded-lg border"
                    />
                  </div>
                )}
                <Textarea
                  placeholder="Optional: Add additional details or modifications to the reference image"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-4"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4">
            <Button 
              onClick={handleImageGeneration} 
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? 'Generating...' : 'Generate Character'}
            </Button>
            
            {seed && (
              <Button 
                onClick={handleRegenerateWithSeed}
                disabled={isGenerating}
                variant="outline"
              >
                Regenerate Same Character
              </Button>
            )}
          </div>
        </div>

        {generatedImage && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Generated Character</h2>
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={generatedImage} 
                alt="Generated character" 
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CharacterGenerator;