import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Edit, Send, Smile } from "lucide-react";

const MeetingSidebar = () => {
  const tasks = [
    { id: 1, text: "Team Discussion", completed: true },
    { id: 2, text: "Daily Work Review at 1:00 PM", completed: false },
    { id: 3, text: "Weekly Report Stand Up Monthly", completed: false },
  ];

  const chatMessages = [
    {
      id: 1,
      sender: "Alicia Padlock",
      time: "2:02 PM",
      message: "How about our problem last week?",
    },
    {
      id: 2,
      sender: "You",
      time: "2:03 PM",
      message: "It's all clear, no worries 😊",
    },
    {
      id: 3,
      sender: "Sri Veronica",
      time: "2:10 PM",
      message:
        "Yes, it's been solved. Since we have daily meeting to discuss everything 😊",
    },
  ];

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      <Tabs defaultValue="summary" className="flex flex-col">
        <TabsList className="grid w-7/8 grid-cols-2 bg-secondary m-4 mb-0">
          <TabsTrigger value="summary" className="text-sm">
            Summary
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-sm">
            Tasks List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="flex-1 p-4 pt-3">
          <Card className="bg-chat-bg border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                During the meeting, we covered some topics and reported that we
                achieved several targets set during the previous meeting. In
                today's
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-6 px-2 text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="flex-1 p-4 pt-3 space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3">
              <Checkbox
                checked={task.completed}
                className="mt-0.5"
                data-state={task.completed ? "checked" : "unchecked"}
              />
              <span
                className={`text-sm flex-1 ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.text}
              </span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Room Chat Section */}
      <div className="border-t border-border">
        <div className="flex items-center justify-center py-2">
          <Button
            variant="ghost"
            className="text-sm font-medium bg-background rounded-full px-4 py-1 h-8"
          >
            Room Chat
          </Button>
          <div className="flex-1"></div>
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground px-4 py-1 h-8"
          >
            Participant
          </Button>
        </div>

        <div className="p-4 space-y-4 max-h-48 overflow-y-auto">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  {msg.sender}
                </span>
                <span className="text-xs text-muted-foreground">
                  {msg.time}
                </span>
              </div>
              <p className="text-sm text-foreground">{msg.message}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type message here..."
              className="flex-1 bg-input border-border text-sm"
            />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Smile className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-8 w-8 p-0 rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingSidebar;
