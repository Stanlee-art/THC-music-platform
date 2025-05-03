
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Edit, 
  Trash, 
  MoreHorizontal, 
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Song {
  id: string;
  title: string;
  track_number: number;
  duration: number | null;
  audio_url: string | null;
  image_url: string | null;
}

interface SongListProps {
  songs: Song[];
  albumId: string;
  canEdit?: boolean;
  onEdit?: (song: Song) => void;
  onDelete?: (song: Song) => void;
  onReorder?: (songs: Song[]) => void;
  onPlay?: (song: Song) => void;
  currentPlayingId?: string | null;
}

const SongList = ({ 
  songs, 
  albumId, 
  canEdit = false,
  onEdit,
  onDelete,
  onReorder,
  onPlay,
  currentPlayingId = null
}: SongListProps) => {
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedSongs, setReorderedSongs] = useState<Song[]>([...songs].sort((a, b) => a.track_number - b.track_number));
  
  // Start reorder mode
  const startReordering = () => {
    setIsReordering(true);
    setReorderedSongs([...songs].sort((a, b) => a.track_number - b.track_number));
  };
  
  // Save new order
  const saveNewOrder = () => {
    if (onReorder) {
      // Update track numbers
      const updatedSongs = reorderedSongs.map((song, index) => ({
        ...song,
        track_number: index + 1
      }));
      onReorder(updatedSongs);
    }
    setIsReordering(false);
  };
  
  // Cancel reordering
  const cancelReordering = () => {
    setIsReordering(false);
  };
  
  // Move song up in order
  const moveSongUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...reorderedSongs];
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      setReorderedSongs(newOrder);
    }
  };
  
  // Move song down in order
  const moveSongDown = (index: number) => {
    if (index < reorderedSongs.length - 1) {
      const newOrder = [...reorderedSongs];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setReorderedSongs(newOrder);
    }
  };
  
  // Handle play/pause
  const handlePlayClick = (song: Song) => {
    if (onPlay) {
      onPlay(song);
    }
  };
  
  if (songs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No songs in this album yet</p>
      </div>
    );
  }
  
  const displaySongs = isReordering ? reorderedSongs : [...songs].sort((a, b) => a.track_number - b.track_number);
  
  return (
    <div>
      {/* Reorder controls */}
      {canEdit && (
        <div className="flex justify-end mb-4">
          {isReordering ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={cancelReordering}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveNewOrder}>
                Save Order
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={startReordering}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Reorder Songs
            </Button>
          )}
        </div>
      )}
      
      {/* Song list */}
      <div className="space-y-1">
        {displaySongs.map((song, index) => (
          <div 
            key={song.id} 
            className={`flex items-center gap-3 py-2 px-3 rounded-md
              ${isReordering ? 'bg-white/5' : 'hover:bg-white/5'}
              ${currentPlayingId === song.id ? 'bg-thc-blue/20' : ''}`}
          >
            {isReordering ? (
              <div className="flex flex-col">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5" 
                  disabled={index === 0}
                  onClick={() => moveSongUp(index)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5" 
                  disabled={index === displaySongs.length - 1}
                  onClick={() => moveSongDown(index)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-8 text-center text-sm text-gray-400">
                {song.track_number}
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              disabled={!song.audio_url}
              onClick={() => handlePlayClick(song)}
            >
              {currentPlayingId === song.id ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <div className="flex-1 min-w-0">
              <p className="truncate">{song.title}</p>
            </div>
            
            <div className="text-sm text-gray-400">
              {song.duration ? formatDuration(song.duration) : "–:––"}
            </div>
            
            {canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(song)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(song)}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;
