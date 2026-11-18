import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageBrightness, getInitials } from "@/lib/utils";
import { ClassDetails, ClassUser } from "@/types";
import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const ClassesShow = () => {
  const { id } = useParams();
  const classId = id ?? "";

  const { query } = useShow<ClassDetails>({ resource: "classes" });

  const classDetails = query.data?.data;
  const theme = useRef<"dark" | "light">("dark");
  useEffect(() => {
    if (classDetails?.bannerUrl) {
      (async () => {
        theme.current = await getImageBrightness(classDetails?.bannerUrl || "");
      })();
    }
  }, [classDetails?.bannerUrl]);

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
        cell: ({ row }) => {
          <ShowButton
            resource="users"
            recordItemId={row.original.id}
            variant={"outline"}
            size={"sm"}
          >
            View
          </ShowButton>;
        },
      },
    ],
    [],
  );

  //   const studentsTable = useTable({
  //     columns: studentColumns,
  //     refineCoreProps: {
  //       resource: `classes/${classId}/users`,
  //     },
  //   });

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
        {bannerUrl ? (
          bannerUrl.includes("res.cloudinary.com") && bannerCldPubId ? (
            <AdvancedImage
              cldImg={bannerPhoto(
                bannerCldPubId ?? "",
                name,
                theme.current === "light",
              )}
              alt="Class Banner"
            />
          ) : (
            <img src={bannerUrl} alt={name} loading="lazy" />
          )
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
        <Button size="lg" className="w-full">
          Join Class
        </Button>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;
