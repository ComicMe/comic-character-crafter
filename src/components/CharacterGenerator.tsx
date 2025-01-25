import React, { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { RunwareService } from '@/services/runware';

const CharacterGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [description, setDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seed, setSeed] = useState<number | null>(null);

  const handleImageGeneration = async () => {
    if (!apiKey) {
      toast.error('Please enter your Runware API key');
      return;
    }

    if (!description) {
      toast.error('Please enter a character description');
      return;
    }

    setIsGenerating(true);
    const runwareService = new RunwareService(apiKey);

    try {
      const prompt = `Create a comic book style character: ${description}. Highly detailed, professional comic art style, full body shot, clean lines, vibrant colors.`;
      
      const result = await runwareService.generateImage({
        positivePrompt: prompt,
        seed: seed,
        CFGScale: 7,
        numberResults: 1,
      });

      setGeneratedImage(result.imageURL);
      setSeed(result.seed); // Save the seed for consistency
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
            <label className="block text-sm font-medium mb-2">Runware API Key</label>
            <Input
              type="password"
              placeholder="Enter your Runware API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Character Description</label>
            <Textarea
              placeholder="Describe your character (e.g., 'a brave young girl with curly red hair and glasses')"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

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