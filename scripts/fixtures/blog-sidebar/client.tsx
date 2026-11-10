import { hydrateRoot } from "react-dom/client"
import { SidebarFixture } from "./fixture"
const fixture = (window as any).__sidebarFixture
hydrateRoot(document.getElementById("root")!, <SidebarFixture {...fixture} />)
