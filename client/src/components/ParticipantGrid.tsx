import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const participants = [
  {
    id: 1,
    name: 'Alicia Padlock',
    initials: 'AP',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=64&h=64&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Sri Veronica',
    initials: 'SV',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Corilyn Stefan',
    initials: 'CS',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face'
  }
];

const ParticipantGrid = () => {
  return (
    <div className="absolute bottom-6 left-6 flex items-center gap-3">
      {participants.map((participant) => (
        <div key={participant.id} className="relative">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground">
              {participant.initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-background px-2 py-1 rounded text-xs font-medium text-foreground border border-border">
              {participant.name.split(' ')[0]}
            </div>
          </div>
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-16 w-8 p-0 bg-black/50 hover:bg-black/70 rounded-full"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </Button>
    </div>
  );
};

export default ParticipantGrid;