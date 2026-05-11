import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProjectCreateForm } from "@/components/projects/ProjectCreateForm";

export default function NewProjectPage() {
  return (
    <DashboardLayout>
      <ProjectCreateForm />
    </DashboardLayout>
  );
}
