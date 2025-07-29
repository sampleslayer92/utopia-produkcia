import AdminLayout from "@/components/admin/AdminLayout";
import OnboardingEditor from "@/components/admin/onboarding/OnboardingEditor";

const AdminOnboardingEditorPage = () => {
  return (
    <AdminLayout 
      title="Onboarding Configuration" 
      subtitle="Manage onboarding steps and fields"
    >
      <OnboardingEditor />
    </AdminLayout>
  );
};

export default AdminOnboardingEditorPage;