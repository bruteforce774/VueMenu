import { createRouter, createWebHashHistory, type RouteRecordRaw, } from "vue-router";

import MenuView from "../views/MenuView.vue";
import MenuItemView from "../views/MenuItemView.vue";
import AddCategoryView from "../views/AddCategoryView.vue";
import AddMenuItemView from "../views/AddMenuItemView.vue";

// Her speiler vi de gamle hash-rutene:
//  - '#'                     → '/'
//  - '#menu'                 → '/menu'
//  - '#menu/:category'       → '/menu/:category'
//  - '#menu-item/:id'        → '/menu-item/:id'
//  - '#add-category'         → '/add-category'
//  - '#add-menu-item'        → '/add-menu-item'
//
// I hash-mode blir URL-ene nå f.eks. '#/menu' istedenfor '#menu'.

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: MenuView,
    },
    {
        path: "/menu",
        name: "menu",
        component: MenuView,
    },
    {
        path: "/menu/:category",
        name: "menu-category",
        component: MenuView,
        props: true, // gjør at `category` blir en prop i MenuView
    },
    {
        path: "/menu-item/:id",
        name: "menu-item",
        component: MenuItemView,
        props: true, // gjør at `id` blir en prop i MenuItemView
    },
    {
        path: "/add-category",
        name: "add-category",
        component: AddCategoryView,
    },
    {
        path: "/add-menu-item",
        name: "add-menu-item",
        component: AddMenuItemView,
    },
    {
        // 404 – tilsvarer notFoundHandler i RouterView.ts
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: {
            template: /*HTML*/`
                <div style="color: red">
                <h2>Page not found</h2>
                </div>
            `,
        },
    },
];

const router = createRouter({
    // Bruker hash-basert historikk for å matche at du brukte window.location.hash før
    history: createWebHashHistory(),
    routes,
});

export default router;
