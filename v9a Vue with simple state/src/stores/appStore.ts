import { reactive, readonly } from "vue";
import type { AppState, MenuItem } from "../types";
import { initialAppState } from "../initialAppState";

const _state = reactive<AppState>(
    initialAppState as AppState
);

function addCategory(category: string): void {
    if (!_state.categories.includes(category)) {
        _state.categories.push(category);
    }
}

function addMenuItem(menuItem: MenuItem): void {
    const maxId = _state.menuItems.reduce(
        (max, mi) => (mi.id > max ? mi.id : max),
        0
    );
    menuItem.id = maxId + 1;
    _state.menuItems.push(menuItem);
}

export function useAppStore() {
    return {
        state: readonly(_state) as Readonly<AppState>,

        // "controller"-metoder
        addCategory,
        addMenuItem,
    };
}
