import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

import { Search } from "lucide-react";

const ClassesList = () => {
  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
            </Select>
            <CreateButton resource="classes" />
          </div>
        </div>
      </div>
    </ListView>
  );
};

export default ClassesList;
