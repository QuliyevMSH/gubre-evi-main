import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    getProfile();
    initStorage();
  }, [user, navigate]);

  async function initStorage() {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars');
      
      // Create bucket if it doesn't exist
      if (!avatarBucket) {
        const { error: createError } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
        });
        
        if (createError) throw createError;
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: "Profil məlumatları yüklənmədi",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
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

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Şəkil seçilmədi');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      // Delete old avatar if exists
      if (profile.avatar_url) {
        const oldFilePath = profile.avatar_url.split('/').pop();
        if (oldFilePath) {
          await supabase.storage
            .from('avatars')
            .remove([oldFilePath]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setProfile({
        ...profile,
        avatar_url: data.publicUrl,
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yüklənir...</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-4">
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
                onChange={uploadAvatar}
                disabled={uploading}
              />
              {uploading ? '...' : '✏️'}
            </label>
          </div>
          <h2 className="text-2xl font-semibold">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-muted-foreground">{user?.email}</p>
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
              value={user?.email || ''}
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
    </div>
  );
}