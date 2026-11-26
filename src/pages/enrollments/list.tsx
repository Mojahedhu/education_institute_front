import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const EnrollmentsList = () => {
  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Enrollments</h1>

      <div className="intro-row">
        <p>Browse and manage Enrollment classes.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              // value={searchQuery}
              onChange={(e) => console.log(e.target.value)}
              placeholder="Search by name..."
              className="pl-10 w-full"
            />
          </div>
          <CreateButton resource="enrollments" />
        </div>
      </div>
    </ListView>
  );
};

export default EnrollmentsList;
