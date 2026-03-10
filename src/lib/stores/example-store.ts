import { Store } from "@tanstack/store";

interface AppState {
  sidebarOpen: boolean;
}

export const appStore = new Store<AppState>({
  sidebarOpen: false,
});
