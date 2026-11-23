import { permanentRedirect } from "next/navigation"

/** This legacy alias previously re-exported the unrelated export-sales page. */
export default function FdaLabelCheckAlias() {
  permanentRedirect("/services/food/label-compliance")
}
