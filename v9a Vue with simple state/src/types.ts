export interface AppState {
    menuItems: MenuItem[];
    categories: string[];
}

export interface MenuItem {
    id: number;
    name: string;
    price: number;           
    category: string;
    description?: string;
    imageUrl?: string;
}

export interface Route {
    path: string;
    handler: HandlerFunction;
}

export type MenuItemParams = { id: string };
export type MenuCategoryParams = { category: string };
export type DummyParams = { country: string; city: string; zip: string };
export type Params = MenuCategoryParams | MenuItemParams | DummyParams;

export type HandlerFunction = 
    (params?: Params) => void;