import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadAvatar } from '@/services/storage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProfileFormProps {
  userId: string;
  initialProfile: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
  userEmail?: string;
}

export function ProfileForm({ userId, initialProfile, userEmail }: ProfileFormProps) {
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Şəkil seçilmədi');
      }

      const file = event.target.files[0];
      const publicUrl = await uploadAvatar(userId, file, profile.avatar_url);
      
      setProfile({
        ...profile,
        avatar_url: publicUrl,
      });
      
      toast({
        title: "Uğurlu!",
        description: "Profil şəkli yükləndi",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Profil şəkli yüklənmədi",
      });
    } finally {
      setUploading(false);
    }
  }

  async function updateProfile() {
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        first_name: profile.first_name,
        last_name: profile.last_name,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast({
        title: "Uğurlu!",
        description: "Profil məlumatları yeniləndi",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Profil məlumatları yenilənmədi",
      });
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={profile.avatar_url || '/placeholder.svg'}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90"
          >
            <input
              type="file"
              id="avatar"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
            {uploading ? '...' : '✏️'}
          </label>
        </div>
        <h2 className="text-2xl font-semibold">
          {profile.first_name} {profile.last_name}
        </h2>
        <p className="text-muted-foreground">{userEmail}</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Ad</Label>
            <Input
              id="firstName"
              type="text"
              value={profile.first_name}
              onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Soyad</Label>
            <Input
              id="lastName"
              type="text"
              value={profile.last_name}
              onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={userEmail || ''}
            disabled
          />
        </div>

        <Button
          className="w-full"
          onClick={updateProfile}
        >
          Yadda saxla
        </Button>
      </div>
    </div>
  );
}