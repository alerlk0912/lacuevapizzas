-- Create pizza_types table to store pizza varieties and prices
CREATE TABLE IF NOT EXISTS pizza_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table to store all order information
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  pizza_type_id UUID NOT NULL REFERENCES pizza_types(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  delivery_time TIME NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Efectivo', 'Transferencia')),
  receipt_received BOOLEAN NOT NULL DEFAULT false,
  pickup_method TEXT NOT NULL CHECK (pickup_method IN ('Retiro en casa', 'Envio')),
  delivery_address TEXT,
  delivered BOOLEAN NOT NULL DEFAULT false,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_pizza_type ON orders(pizza_type_id);

-- Insert initial pizza types from the spreadsheet
INSERT INTO pizza_types (name, price) VALUES
  ('Mozzarella', 8000),
  ('Fugazzeta', 9000),
  ('Napolitana', 9000),
  ('Siciliana', 9000),
  ('Jamon y Morron', 10000),
  ('Panceta y Verdeo', 10000),
  ('3 Quesos', 10000),
  ('Vegetales', 9000),
  ('Pepperoni', 10000),
  ('Empanadas x12', 18000),
  ('Empanadas x6', 10000)
ON CONFLICT (name) DO NOTHING;
