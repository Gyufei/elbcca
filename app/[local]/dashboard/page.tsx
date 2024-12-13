import Calendar from "@/components/dashboard/calendar";

export default function Dashboard() {
  return (
    <div className="flex h-[calc(100vh-70px)] items-stretch justify-between">
      <Calendar />
    </div>
  );
}
