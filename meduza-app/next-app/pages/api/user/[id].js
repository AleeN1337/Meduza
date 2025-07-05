import dbConnect from "../../../lib/mongoose";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await dbConnect();

  try {
    const user = await User.findById(req.query.id).select(
      "firstName lastName avatarUrl"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
