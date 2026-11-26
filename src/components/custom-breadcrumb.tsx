import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Link } from "react-router";
import { Home } from "lucide-react";
import { Separator } from "./ui/separator";

interface CustomBreadcrumbPops {
  prevUrl?: string;
  curUrl?: string;
}

const CustomBreadcrumb = ({ prevUrl, curUrl }: CustomBreadcrumbPops) => {
  const prevUrlPath =
    (prevUrl?.charAt(0)?.toUpperCase() ?? "") + (prevUrl?.slice(1) ?? "");
  const curUrlPath =
    (curUrl?.charAt(0)?.toUpperCase() ?? "") + (curUrl?.slice(1) ?? "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {prevUrl && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={prevUrl}>{prevUrlPath}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {curUrl && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{curUrlPath}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        <Separator className="flex-1" />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
