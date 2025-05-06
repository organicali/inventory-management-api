CREATE TABLE "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sku" text NOT NULL,
	"quantity" integer DEFAULT 0,
	"price" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "product_sku_unique" UNIQUE("sku")
);
