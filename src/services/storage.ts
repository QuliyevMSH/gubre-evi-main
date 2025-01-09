import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function initAvatarStorage() {
  try {
    // First check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars');
    
    if (!avatarBucket) {
      // Create bucket with public access
      const { error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
}

export async function uploadAvatar(userId: string, file: File, oldAvatarUrl?: string) {
  try {
    // Delete old avatar if exists
    if (oldAvatarUrl) {
      const oldFilePath = oldAvatarUrl.split('/').pop();
      if (oldFilePath) {
        await supabase.storage
          .from('avatars')
          .remove([oldFilePath]);
      }
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}