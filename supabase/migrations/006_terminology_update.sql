-- ============================================================
-- Terminology update: Reservation → Pre-Order
-- Updates display labels only.
-- Keys, IDs, transition rules, and schema are unchanged.
-- ============================================================

-- Rename the Reservation workflow
UPDATE merch_workflows
SET    name        = 'Pre-Order Workflow',
       description = 'Group buying with MOQ threshold. No payment until minimum quantity reached.'
WHERE  id = 'a1000001-0000-0000-0000-000000000000';

-- Update state display labels for the Pre-Order Workflow
UPDATE merch_workflow_states SET label = 'Pre-Ordered'      WHERE workflow_id = 'a1000001-0000-0000-0000-000000000000' AND key = 'reserved';
UPDATE merch_workflow_states SET label = 'MOQ Confirmed'    WHERE workflow_id = 'a1000001-0000-0000-0000-000000000000' AND key = 'confirmed';
UPDATE merch_workflow_states SET label = 'Payment Requested' WHERE workflow_id = 'a1000001-0000-0000-0000-000000000000' AND key = 'payment_requested';
UPDATE merch_workflow_states SET label = 'Paid'             WHERE workflow_id = 'a1000001-0000-0000-0000-000000000000' AND key = 'paid';
UPDATE merch_workflow_states SET label = 'In Production'    WHERE workflow_id = 'a1000001-0000-0000-0000-000000000000' AND key = 'production';
UPDATE merch_workflow_states SET label = 'Completed'        WHERE workflow_id = 'a1000001-0000-0000-0000-000000000000' AND key = 'completed';
