import { CLOUDINARY_CLOUD_NAME } from "@/constants";
import { dpr, format } from "@cloudinary/url-gen/actions/delivery";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Cloudinary } from "@cloudinary/url-gen";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/TextStyle";

// Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});

export const bannerPhoto = (
  imageCldPubId: string,
  name: string,
  isLight: boolean,
) => {
  const textColor = isLight ? "#0f172a" : "#ffffff";
  return (
    cld
      .image(imageCldPubId)
      .resize(
        fill().width(1200).height(297), // Aspect ration 5:1
      )
      // Optimize for web
      .delivery(format("auto"))
      .delivery(dpr("auto"))
      // Text overlay with name
      .overlay(
        source(
          text(name, new TextStyle("roboto", 42).fontWeight("bold")).textColor(
            textColor,
          ),
        ).position(
          new Position()
            .gravity(compass("south_west"))
            .offsetX(0.02)
            .offsetY(0.2),
        ),
      )
  );
};
