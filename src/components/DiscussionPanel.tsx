import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Smile, Trash2, Reply } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button as UIButton } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  user_photo?: string;
  reactions?: { [emoji: string]: string[] };
}

interface DiscussionPanelProps {
  groupId: string;
  groupName: string;
}

const DiscussionPanel = ({ groupId, groupName }: DiscussionPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const reactions = ["👍", "❤️", "😊", "🎉", "👏"];

  useEffect(() => {
    fetchMessages();
    getCurrentUser();
    subscribeToMessages();
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    // Fetch user profiles for messages
    const userIds = [...new Set(data.map(msg => msg.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, name, photo")
      .in("user_id", userIds);

    const messagesWithUsers = data.map(msg => {
      const profile = profiles?.find(p => p.user_id === msg.user_id);
      return {
        ...msg,
        user_name: profile?.name || "Unknown User",
        user_photo: profile?.photo || undefined
      };
    });

    setMessages(messagesWithUsers);
    setLoading(false);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`group_messages_${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          
          // Fetch user profile for the new message
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_id, name, photo")
            .eq("user_id", newMsg.user_id)
            .single();

          const messageWithUser = {
            ...newMsg,
            user_name: profile?.name || "Unknown User",
            user_photo: profile?.photo || undefined
          };

          setMessages(prev => [...prev, messageWithUser]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from("group_messages")
      .insert([{
        group_id: groupId,
        user_id: user.id,
        message: newMessage.trim()
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return;
    }

    setNewMessage("");
    setReplyingTo(null);
  };

  const handleDeleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from("group_messages")
      .delete()
      .eq("id", messageId)
      .eq("user_id", currentUserId!);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-[600px] flex flex-col animate-fade-in">
      <CardHeader className="border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          Discussion - {groupName}
          <span className="text-sm font-normal text-muted-foreground">
            ({messages.length} messages)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="text-center text-muted-foreground py-8 animate-pulse-subtle">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const isCurrentUser = msg.user_id === currentUserId;
                const showDateDivider = index === 0 || 
                  new Date(messages[index - 1].created_at).toDateString() !== 
                  new Date(msg.created_at).toDateString();

                return (
                  <div key={msg.id} className="animate-fade-in">
                    {showDateDivider && (
                      <div className="flex items-center justify-center my-4">
                        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {new Date(msg.created_at).toLocaleDateString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    )}
                    <div className={`flex gap-3 group ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={msg.user_photo} />
                        <AvatarFallback>{msg.user_name?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col ${isCurrentUser ? "items-end" : ""} max-w-[70%]`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{msg.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="relative">
                          <div
                            className={`rounded-2xl px-4 py-2 transition-all hover:shadow-md ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {replyingTo?.id === msg.id && (
                              <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
                                <Reply className="h-3 w-3" />
                                Replying to this message
                              </div>
                            )}
                            <p className="text-sm break-words">{msg.message}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <UIButton variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Smile className="h-3 w-3" />
                                </UIButton>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {reactions.map(emoji => (
                                  <DropdownMenuItem key={emoji} className="text-lg cursor-pointer">
                                    {emoji}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <UIButton
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setReplyingTo(msg)}
                            >
                              <Reply className="h-3 w-3" />
                            </UIButton>
                            {isCurrentUser && (
                              <UIButton
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteMessage(msg.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </UIButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>
        <form onSubmit={sendMessage} className="p-4 border-t space-y-2">
          {replyingTo && (
            <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <Reply className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Replying to {replyingTo.user_name}</span>
              </div>
              <UIButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
              >
                ✕
              </UIButton>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 transition-all focus:ring-2 focus:ring-primary"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!newMessage.trim()}
              className="transition-all hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DiscussionPanel;
