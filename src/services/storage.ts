import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export async function initAvatarStorage() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars');
    if (!avatarBucket) {
      const { error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
    }

    // Set public bucket policy
    const { error: policyError } = await supabase.storage.from('avatars').createSignedUrl(
      'dummy.txt',
      60,
      {
        transform: {
          width: 100,
          height: 100,
        },
      }
    );

    if (policyError && !policyError.message.includes('Object not found')) {
      console.error('Error setting bucket policy:', policyError);
      return false;
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
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}