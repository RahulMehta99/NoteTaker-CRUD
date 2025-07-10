-- Check email verification settings
SELECT 
    key, 
    value 
FROM auth.config 
WHERE key IN (
    'email_confirm_url',
    'email_change_confirm_url',
    'email_recovery_url'
);

-- Check if email confirmation is enabled
SELECT 
    raw_app_meta_data->>'email_verified' as email_verified,
    email_confirmed_at,
    created_at,
    email
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
