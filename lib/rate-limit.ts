import { createHash } from "node:crypto";
import RateLimit from "@/models/RateLimit";
import { connectDB } from "@/lib/db";
// Database-backed fixed windows work across application instances. Key on the
// normalized account identifier rather than trusting spoofable proxy headers.
export async function allowAuth(identifier: string, action: string) {
  await connectDB();
  const window = Math.floor(Date.now() / 900000);
  const hash = createHash("sha256").update(identifier).digest("hex");
  const id = `${action}:${hash}:${window}`;
  let record;
  try {
    record = await RateLimit.findOneAndUpdate({ _id: id }, {
      $inc: { hits: 1 }, $setOnInsert: { expiresAt: new Date((window + 1) * 900000) },
    }, { upsert: true, new: true });
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;
    record = await RateLimit.findOneAndUpdate({ _id: id }, { $inc: { hits: 1 } }, { new: true });
  }
  return record && record.hits <= 10;
}
