import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePhotoUploadProps {
  currentPhoto: string | null;
  userName: string;
  onPhotoUpdate: (url: string) => void;
}

const ProfilePhotoUpload = ({ currentPhoto, userName, onPhotoUpdate }: ProfilePhotoUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      // Delete old photo if exists
      if (currentPhoto) {
        const oldPath = currentPhoto.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // Upload new photo
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      onPhotoUpdate(publicUrl);
      
      toast({
        title: "Success",
        description: "Profile photo updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24 ring-4 ring-background">
        <AvatarImage src={currentPhoto || "/placeholder.svg"} />
        <AvatarFallback className="bg-gradient-hero text-primary-foreground text-2xl">
          {userName?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <label htmlFor="photo-upload">
        <Button 
          size="icon" 
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
          variant="default"
          disabled={uploading}
          asChild
        >
          <div>
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </div>
        </Button>
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={uploadPhoto}
        disabled={uploading}
      />
    </div>
  );
};

export default ProfilePhotoUpload;