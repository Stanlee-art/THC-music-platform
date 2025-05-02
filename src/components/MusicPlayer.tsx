
import { useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 235; // Example duration in seconds (3:55)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="fixed bottom-0 w-full h-20 bg-black border-t border-white/10 px-4 flex items-center">
      <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center w-1/4">
          <div className="w-14 h-14 bg-gray-800 rounded mr-3 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb"
              alt="Album Cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-white">Cosmic Flow</h4>
            <p className="text-xs text-gray-400">THC Artists</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="flex items-center space-x-4 mb-2">
            <Button size="icon" variant="ghost" className="text-white h-8 w-8">
              <SkipBack size={16} />
            </Button>
            <Button
              size="icon"
              className={cn(
                "bg-thc-blue hover:bg-thc-blue-light text-white h-10 w-10 rounded-full", 
                isPlaying ? "animate-pulse-slow" : ""
              )}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="text-white h-8 w-8">
              <SkipForward size={16} />
            </Button>
          </div>
          <div className="w-full flex items-center space-x-2">
            <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
            <Slider
              className="flex-1"
              value={[currentTime]}
              min={0}
              max={duration}
              step={1}
              onValueChange={(vals) => setCurrentTime(vals[0])}
            />
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end w-1/4">
          <Volume2 size={20} className="text-gray-400 mr-2" />
          <Slider className="w-24" defaultValue={[75]} max={100} step={1} />
        </div>
      </div>
    </div>
  );
}
