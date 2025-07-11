-- Create notification types and priorities
CREATE TYPE notification_type AS ENUM (
  'contract_created',
  'contract_status_changed', 
  'merchant_registered',
  'error_occurred',
  'system_alert'
);

CREATE TYPE notification_priority AS ENUM (
  'low',
  'medium', 
  'high',
  'critical'
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_entity_id UUID,
  entity_type entity_type,
  is_read BOOLEAN NOT NULL DEFAULT false,
  priority notification_priority NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all notifications"
ON notifications FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Partners can view their related notifications"
ON notifications FOR SELECT  
USING (
  has_role(auth.uid(), 'partner'::app_role) AND
  (user_id = auth.uid() OR 
   (entity_type = 'contracts' AND related_entity_id IN (
     SELECT id FROM contracts WHERE created_by = auth.uid()
   )))
);

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create notifications for contract events
CREATE OR REPLACE FUNCTION create_contract_notification()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Get admin users to notify
  FOR admin_user_id IN 
    SELECT DISTINCT ur.user_id 
    FROM user_roles ur 
    WHERE ur.role = 'admin'
  LOOP
    IF TG_OP = 'INSERT' THEN
      notification_title := 'Nová zmluva vytvorená';
      notification_message := 'Bola vytvorená nová zmluva ' || NEW.contract_number;
      
      INSERT INTO notifications (
        user_id, type, title, message, related_entity_id, entity_type, priority
      ) VALUES (
        admin_user_id, 'contract_created', notification_title, notification_message, 
        NEW.id, 'contracts', 'medium'
      );
      
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
      notification_title := 'Zmena statusu zmluvy';
      notification_message := 'Zmluva ' || NEW.contract_number || ' zmenila status na ' || NEW.status;
      
      INSERT INTO notifications (
        user_id, type, title, message, related_entity_id, entity_type, priority
      ) VALUES (
        admin_user_id, 'contract_status_changed', notification_title, notification_message,
        NEW.id, 'contracts', 'medium'
      );
    END IF;
  END LOOP;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for contract notifications
CREATE TRIGGER contract_notification_trigger
  AFTER INSERT OR UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION create_contract_notification();

-- Function to create notifications for merchant events  
CREATE OR REPLACE FUNCTION create_merchant_notification()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin users to notify
  FOR admin_user_id IN 
    SELECT DISTINCT ur.user_id 
    FROM user_roles ur 
    WHERE ur.role = 'admin'
  LOOP
    INSERT INTO notifications (
      user_id, type, title, message, related_entity_id, entity_type, priority
    ) VALUES (
      admin_user_id, 'merchant_registered', 'Nový merchant zaregistrovaný',
      'Zaregistroval sa nový merchant: ' || NEW.company_name,
      NEW.id, 'merchants', 'low'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for merchant notifications
CREATE TRIGGER merchant_notification_trigger
  AFTER INSERT ON merchants
  FOR EACH ROW
  EXECUTE FUNCTION create_merchant_notification();