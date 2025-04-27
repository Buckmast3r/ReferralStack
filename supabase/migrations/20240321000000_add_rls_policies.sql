-- 1. Fix user_id type
ALTER TABLE referrals ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- 2. Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
CREATE POLICY "Users can view their own referrals"
ON referrals FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own referrals"
ON referrals FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own referrals"
ON referrals FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own referrals"
ON referrals FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- 4. Create index
CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON referrals(user_id);

-- Add created_at and updated_at triggers if they don't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 