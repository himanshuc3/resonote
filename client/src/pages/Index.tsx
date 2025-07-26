import MeetingHeader from "@/components/MeetingHeader";
import VideoPlayer from "@/components/VideoPlayer";
import MeetingSidebar from "@/components/MeetingSidebar";

import "@/pages/index.css";
const Index = () => {
  return (
    <div className="bg-background flex flex-col container h-screen">
      <MeetingHeader />

      <div className=" flex">
        {/* Main video playback area */}
        <div className="flex-1 p-6">
          <VideoPlayer className="w-full min-h-[500px]" />
        </div>

        {/* Sidebar */}
        <MeetingSidebar />
      </div>
    </div>
  );
};

export default Index;
