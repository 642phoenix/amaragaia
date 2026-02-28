/**
 * Simple script to seed the MongoDB `products` collection with example items.
 * Run with `node -r ts-node/register scripts/seedProducts.ts` (requires ts-node)
 * or compile to JS first.
 *
 * Make sure MONGO_URI is set in your environment.
 */

import clientPromise from "../lib/mongodb";

async function main() {
  const client = await clientPromise;
  const db = client.db();
  const coll = db.collection("products");

  const sample = [
    {
      name: "Talco Orgánico 95g",
      category: "Cuidado Personal",
      price: 225,
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      description:
        "Talco orgánico antimicótico, apto vegano y eco-friendly. Combate y cura hongos del pie de atleta.",
    },
    {
      name: "Copa Menstrual",
      category: "Cuidado Personal",
      price: 450,
      image:
        "https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=400&h=400&fit=crop",
      description:
        "Copa menstrual de silicona de grado médico. Reutilizable, dura hasta 12 años.",
    },
    {
      name: "Shampoo Sólido",
      category: "Cuidado Personal",
      price: 320,
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
      description: "Champú sólido 100% natural a base de plantas. Dura hasta 3 meses.",
    },
  ];

  await coll.insertMany(sample);
  console.log("Seeded products collection with", sample.length, "items");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});