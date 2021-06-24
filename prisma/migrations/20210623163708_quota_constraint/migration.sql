-- This is an empty migration.
ALTER TABLE "quota"
	ADD CONSTRAINT "max_capacity" CHECK ("occupied" <= "staff_capacity");
