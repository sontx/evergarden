import { FormattedMessage } from "react-intl";
import useSuggestedStories from "../hooks/useSuggestedStories";
import { PreviewPanel } from "../../../components/PreviewPanel";

export function EditorSuggestions() {
  const { data } = useSuggestedStories();
  return (
    <PreviewPanel
      title={<FormattedMessage id="homeEditorSuggestions" />}
      stories={data}
    />
  );
}
