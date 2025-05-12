-- Add subscription-related columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMP WITH TIME ZONE;

-- Create index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON profiles(subscription_id);

-- Add constraint to ensure valid subscription status
ALTER TABLE profiles
ADD CONSTRAINT valid_subscription_status 
CHECK (subscription_status IN ('free', 'active', 'past_due', 'canceled', 'unpaid'));

-- Add constraint to ensure valid payment status
ALTER TABLE profiles
ADD CONSTRAINT valid_payment_status 
CHECK (payment_status IN ('free', 'paid', 'failed')); 