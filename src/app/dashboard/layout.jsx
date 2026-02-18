// যদি metadata থাকে, সেটা named export হবে
export const metadata = {
  title: 'Appointment Dashboard',
  description: 'Manage your appointments',
};

// এই অংশটি মিসিং বা ভুল থাকার কারণেই এরর আসছে
export default function DashboardLayout({ children }) {
  return (
    <section>
      {/* এখানে আপনার লেআউটের ডিজাইন থাকতে পারে */}
      <div className="p-4">
        {children}
      </div>
    </section>
  );
}