import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { initAvatarStorage } from '@/services/storage';

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
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
    initAvatarStorage();
  }, [user, navigate]);

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yüklənir...</div>;
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <ProfileForm 
        userId={user?.id || ''} 
        initialProfile={profile}
        userEmail={user?.email}
      />
    </div>
  );
}