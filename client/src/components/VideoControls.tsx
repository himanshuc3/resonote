import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, MonitorSpeaker, Phone, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const VideoControls = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 bg-black/80 rounded-full px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMicOn(!isMicOn)}
          className={`h-10 w-10 p-0 rounded-full ${
            isMicOn ? 'bg-control-hover hover:bg-control-hover/80' : 'bg-destructive hover:bg-destructive/80'
          }`}
        >
          {isMicOn ? (
            <Mic className="h-4 w-4 text-white" />
          ) : (
            <MicOff className="h-4 w-4 text-white" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`h-10 w-10 p-0 rounded-full ${
            isCameraOn ? 'bg-control-hover hover:bg-control-hover/80' : 'bg-destructive hover:bg-destructive/80'
          }`}
        >
          {isCameraOn ? (
            <Video className="h-4 w-4 text-white" />
          ) : (
            <VideoOff className="h-4 w-4 text-white" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-full bg-control-hover hover:bg-control-hover/80"
        >
          <MonitorSpeaker className="h-4 w-4 text-white" />
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="h-10 w-10 p-0 rounded-full"
        >
          <Phone className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-full bg-control-hover hover:bg-control-hover/80"
        >
          <MoreHorizontal className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;