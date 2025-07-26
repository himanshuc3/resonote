import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MeetingHeader = () => {
  return (
    <div className="bg-background border-b border-border p-4">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Video Title</h1>
        </div>
      </div>
    </div>
  );
};

export default MeetingHeader;
