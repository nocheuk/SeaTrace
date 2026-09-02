-- Storage buckets and policies

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('report-images', 'report-images', false, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', false, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Report images: users upload to their own folder user_id/report_id/filename
CREATE POLICY "Users upload report images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'report-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own report images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'report-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authenticated users can read report images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'report-images');

CREATE POLICY "Anon can read report images via signed URLs"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'report-images');

-- Avatars
CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Avatars readable by authenticated"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Avatars readable by anon"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'avatars');
