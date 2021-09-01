import { capitalize } from "../../../utils/string-utils";
import { FormattedMessage } from "react-intl";
import { Divider } from "rsuite";
import moment from "moment";

export function TimeSubtitle({
  type,
}: {
  type: "today" | "week" | "month" | "year";
}) {
  let subtitle;
  const now = moment();
  switch (type) {
    case "today":
      subtitle = now.format("DD-MMM");
      break;
    case "week":
      subtitle = `${now.startOf("isoWeek").format("DD-MMM")} - ${now
        .endOf("isoWeek")
        .format("DD-MMM")}`;
      break;
    case "month":
      subtitle = now.format("MMMM");
      break;
    case "year":
      subtitle = now.format("YYYY");
      break;
  }
  return (
    <>
      <FormattedMessage id={`homeTopViewsStories${capitalize(type)}`} />{" "}
      {subtitle && (
        <>
          <Divider vertical />
          {subtitle}
        </>
      )}
    </>
  );
}
