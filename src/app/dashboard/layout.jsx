
export const metadata = {
  title: 'Appointment Dashboard',
  description: 'Manage your appointments',
};


export default function DashboardLayout({ children }) {
  return (
    <section>
      {/* Layout design */}
      <div className="p-4">
        {children}
      </div>
    </section>
  );
}