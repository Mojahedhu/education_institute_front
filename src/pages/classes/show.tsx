import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { ClassDetails, ClassUser } from "@/types";
import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { useNavigate, useParams } from "react-router";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useMemo } from "react";

const ClassesShow = () => {
  // const [imgError, setImgError] = useState(false);
  // const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { id } = useParams();
  const navigate = useNavigate();
  const classId = id ?? "";

  const { query } = useShow<ClassDetails>({
    resource: "classes",
    queryOptions: {
      enabled: !!classId,
    },
  });

  const classDetails = query.data?.data;

  // useEffect(() => {
  //   if (classDetails?.bannerUrl) {
  //     let isMount = true;
  //     (async () => {
  //       try {
  //         const returnTheme = await getImageBrightness(
  //           classDetails?.bannerUrl || "",
  //         );
  //         if (isMount) {
  //           setTheme(returnTheme);
  //           setImgError(false);
  //         }
  //       } catch (error) {
  //         console.log("Resolve image color error:", error);
  //         if (isMount) {
  //           setImgError(true);
  //         }
  //       }
  //     })();

  //     return () => {
  //       isMount = false;
  //     };
  //   }
  // }, [classDetails?.bannerUrl]);

  const studentColumns = useMemo<ColumnDef<ClassUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.image && (
                <AvatarImage src={row.original.image} alt={row.original.name} />
              )}
              <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span>{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "details",
        size: 140,
        header: () => <p className="column-title">Details</p>,
        cell: ({ row }) => (
          <ShowButton
            resource="users"
            recordItemId={row.original.id}
            variant={"outline"}
            size={"sm"}
          >
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const studentsTable = useTable({
    columns: studentColumns,
    refineCoreProps: {
      resource: `classes/${classId}/users`,
      syncWithLocation: false, // Prevents URL query params (?pageSize=10&currentPage=1) from conflicting with pageSize: 3
      pagination: {
        pageSize: 3,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq",
            value: "student",
          },
        ],
      },
    },
  });

  if (query.isLoading || query.isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Classes Details" />
        <p className="state-message">
          {query.isLoading
            ? "Loading class details..."
            : query.isError
              ? "Failed to load class details."
              : "Class details not found"}
        </p>
      </ShowView>
    );
  }

  const {
    bannerCldPubId,
    name,
    bannerUrl,
    description,
    capacity,
    status,
    teacher,
    department,
    subject,
  } = classDetails!;

  const teacherName = teacher?.name ?? "Unknown";
  const teacherInitials = getInitials(teacherName, "first");

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teacherInitials || "NA")}`;

  return (
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader resource="classes" title="Classes Details" />

      <div className="banner">
        {bannerUrl &&
        // !imgError &&
        bannerUrl.includes("res.cloudinary.com") &&
        bannerCldPubId ? (
          <AdvancedImage
            cldImg={bannerPhoto(bannerCldPubId ?? "", name)}
            alt="Class Banner"
          />
        ) : bannerUrl ? (
          <img src={bannerUrl} alt={name} loading="lazy" />
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        {/* Class details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{name}</h1>
              <p>{description}</p>
            </div>

            <div>
              <Badge variant={"outline"}>{capacity}</Badge>
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                data-status={status}
              >
                {status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="details-grid">
            <div className="instructor">
              <p>👩‍🏫 Instructor</p>
              <div>
                <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />
                <div>
                  <p>{teacherName}</p>
                  <p>{teacher?.email ?? ""}</p>
                </div>
              </div>
            </div>

            <div className="department">
              <p>🏛️ Department</p>

              <div>
                <p>{department?.name ?? ""}</p>
                <p>{department?.description ?? ""}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div className="subject">
          <p>📚 Subjects</p>

          <div>
            <Badge variant={"outline"}>
              Code: <span>{subject?.code}</span>
            </Badge>
            <p>{subject?.name}</p>
            <p>{subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Join Class Section */}
        <div className="join">
          <h2>🎓 Join Class</h2>

          <ol>
            <li>Ask your teacher for the invite code.</li>
            <li>Click on &quot;Join Class&quot; button.</li>
            <li>Paste the code and click &quot;Join&quot;</li>
          </ol>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate(`/classes/show/${classId}/join`)}
        >
          Join Class
        </Button>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={studentsTable} paginationVariant="simple" />
        </CardContent>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;
