import UserAvatar from "../components/UserAvatar";

export default function Home() {
  const userId = "USER_ID_HERE";
  return (
    <main className="p-4">
      <UserAvatar userId={userId} />
    </main>
  );
}
