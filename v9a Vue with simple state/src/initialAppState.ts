import type { AppState } from "./types";

export const initialAppState: AppState = {
  categories: ["Drikke", "Bakverk", "Småretter", "Sandwich", "Salat"],
  menuItems: [
    // Drikke
    {
      id: 1,
      name: "Espresso",
      price: 32,
      category: "Drikke",
      description: "Enkel espresso, 30 ml.",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80" // Espresso kopp
    },
    {
      id: 2,
      name: "Cappuccino",
      price: 49,
      category: "Drikke",
      description: "Espresso med steamet melk og skum.",
      imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80" // Cappuccino
    },
    {
      id: 3,
      name: "Iste",
      price: 45,
      category: "Drikke",
      description: "Hjemmelaget sitron-iste.",
      imageUrl: "https://images.unsplash.com/photo-1571091718767-42b5ab17fcf0?auto=format&fit=crop&w=600&q=80" // Iste med sitron
    },

    // Bakverk
    {
      id: 10,
      name: "Brownie",
      price: 39,
      category: "Bakverk",
      description: "Saftig sjokoladebrownie.",
      imageUrl: "https://images.unsplash.com/photo-1599785209707-19ae30b155a2?auto=format&fit=crop&w=600&q=80" // Brownie
    },
    {
      id: 11,
      name: "Croissant",
      price: 36,
      category: "Bakverk",
      description: "Smør-croissant, sprø og luftig.",
      imageUrl: "https://images.unsplash.com/photo-1559631420-1400e421630e?auto=format&fit=crop&w=600&q=80" // Croissant
    },

    // Småretter
    {
      id: 20,
      name: "Dagens suppe",
      price: 98,
      category: "Småretter",
      description: "Serveres med brød og smør.",
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80" // Suppe
    },
    {
      id: 21,
      name: "Ost & kjeks",
      price: 119,
      category: "Småretter",
      description: "Utvalg av oster med kjeks.",
      imageUrl: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=600&q=80" // Ost & kjeks
    },

    // Sandwich
    {
      id: 30,
      name: "Kyllingsandwich",
      price: 129,
      category: "Sandwich",
      description: "Kylling, aioli, salat, tomat.",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80" // Sandwich
    },
    {
      id: 31,
      name: "Veggie sandwich",
      price: 119,
      category: "Sandwich",
      description: "Avokado, hummus, grønnsaker.",
      imageUrl: "https://images.unsplash.com/photo-1559563456-1b7f3b8fa73c?auto=format&fit=crop&w=600&q=80" // Veggie sandwich
    },

    // Salat
    {
      id: 40,
      name: "Cæsarsalat",
      price: 139,
      category: "Salat",
      description: "Kylling, krutonger, parmesan.",
      imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80" // Cæsarsalat
    },
    {
      id: 41,
      name: "Bete & feta",
      price: 129,
      category: "Salat",
      description: "Rødbeter, feta, valnøtter.",
      imageUrl: "https://images.unsplash.com/photo-1572448862528-8fdbd574b492?auto=format&fit=crop&w=600&q=80" // Rødbet- & feta-salat
    },
  ],
};
