
import AdminLayout from "@/components/admin/AdminLayout";
import DealsKanbanBoard from "@/components/admin/deals/DealsKanbanBoard";

const DealsPage = () => {
  return (
    <AdminLayout
      title="Deals"
      subtitle="Správa deals pomocou Kanban dosky"
    >
      <DealsKanbanBoard />
    </AdminLayout>
  );
};

export default DealsPage;
