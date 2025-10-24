-- Migration script to update orders table structure

-- First, drop the old columns that shouldn't be in orders table
ALTER TABLE orders DROP COLUMN IF EXISTS pizza_type_id;
ALTER TABLE orders DROP COLUMN IF EXISTS quantity;

-- Add receipt_status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'receipt_status'
  ) THEN
    -- Add the new column
    ALTER TABLE orders ADD COLUMN receipt_status TEXT NOT NULL DEFAULT 'Pendiente' 
      CHECK (receipt_status IN ('Pendiente', 'Recibido'));
    
    -- Migrate data from receipt_received to receipt_status if receipt_received exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'receipt_received'
    ) THEN
      UPDATE orders SET receipt_status = CASE 
        WHEN receipt_received = true THEN 'Recibido'
        ELSE 'Pendiente'
      END;
      
      -- Drop the old column
      ALTER TABLE orders DROP COLUMN receipt_received;
    END IF;
  END IF;
END $$;

-- Ensure all constraints are correct
DO $$
BEGIN
  -- Check if payment_method constraint exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check 
      CHECK (payment_method IN ('Efectivo', 'Transferencia'));
  END IF;

  -- Check if pickup_method constraint exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'orders' AND column_name = 'pickup_method'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_pickup_method_check 
      CHECK (pickup_method IN ('Retiro en casa', 'Envio'));
  END IF;
END $$;
