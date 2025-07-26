import { Circle, Square, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecordingIndicator = () => {
  return (
    <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
      <div className="flex items-center gap-2 bg-black/80 rounded-full px-3 py-2">
        <div className="flex items-center gap-2">
          <Circle className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
          <span className="text-sm text-white font-medium">Recording in Progress...</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 bg-black/80 rounded-full px-2 py-2">
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/20">
          <Square className="h-3 w-3 text-white" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/20">
          <Settings className="h-3 w-3 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default RecordingIndicator;