import { CoffeeFactory } from "./factories/CoffeeFactory.js";
import { Order } from "./models/Order.js";
import { Customization } from "./models/Customization.js";
import { IndexedDBDatabase } from "./dao/Database.js";
import { OrderDAO } from "./dao/OrderDAO.js";
import { InventoryManager } from "./managers/InventoryManager.js";

class CoffeeShopApp {
    private db: IndexedDBDatabase;
    private orderDAO: OrderDAO;
    private inventoryManager: InventoryManager;

    constructor() {
        this.db = new IndexedDBDatabase();
        this.orderDAO = new OrderDAO(this.db);
        this.inventoryManager = InventoryManager.getInstance();
    }

    public async initialize(): Promise<void> {
        await this.initDatabase();
        this.setupUI();
    }

    private async initDatabase(): Promise<void> {
        try {
            await this.db.init(); // ✅ Initialize the already existing instance
            console.log("Database initialized successfully");
        } catch (error) {
            console.error("Failed to initialize database:", error);
        }
    }

    private setupUI(): void {
        const coffeeTypeSelect = document.getElementById("coffeeType") as HTMLSelectElement;
        const customizationsDiv = document.getElementById("customizations") as HTMLDivElement;
        const addCustomizationBtn = document.getElementById("addCustomization") as HTMLButtonElement;
        const placeOrderBtn = document.getElementById("placeOrder") as HTMLButtonElement;
        const ordersList = document.getElementById("ordersList") as HTMLUListElement;

        // Available customizations
        const availableCustomizations: { [key: string]: Customization } = {
            milk: new Customization("Milk", 0.5),
            sugar: new Customization("Sugar", 0.2),
            whippedCream: new Customization("Whipped Cream", 1.0),
            caramel: new Customization("Caramel", 0.8),
            cinnamon: new Customization("Cinnamon", 0.3)
        };

        // Add customization dropdown
        const customizationSelect = document.createElement("select");
        Object.keys(availableCustomizations).forEach(key => {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = availableCustomizations[key].getName();
            customizationSelect.appendChild(option);
        });

        addCustomizationBtn.addEventListener("click", () => {
            const selectedCustomization = availableCustomizations[customizationSelect.value];
            const customizationItem = document.createElement("div");
            customizationItem.className = "customization-item";
            customizationItem.innerHTML = `
                <span>${selectedCustomization.getName()} (+$${selectedCustomization.getPrice().toFixed(2)})</span>
                <button class="remove-btn">Remove</button>
            `;
            customizationItem.querySelector(".remove-btn")?.addEventListener("click", () => {
                customizationItem.remove();
            });
            customizationsDiv.appendChild(customizationItem);
        });

        // Place order
        placeOrderBtn.addEventListener("click", async () => {
            try {
                const coffeeType = coffeeTypeSelect.value;
                const coffee = CoffeeFactory.createCoffee(coffeeType);

                // Get selected customizations
                const customizationItems = customizationsDiv.querySelectorAll(".customization-item");
                const customizations = Array.from(customizationItems).map(item => {
                    const text = item.querySelector("span")?.textContent || "";
                    const name = text.split(" (+$")[0];
                    const price = parseFloat(text.match(/\$([0-9.]+)/)?.[1] || "0");
                    return new Customization(name, price);
                });

                // Create and save order
                const order = new Order(coffee, customizations);
                await this.orderDAO.save(order);

                // Update inventory (simplified)
                this.updateInventory(coffeeType, customizations);

                // Refresh orders list
                await this.displayOrders();

                // Reset form
                coffeeTypeSelect.value = "espresso";
                customizationsDiv.innerHTML = "";
                
                alert(`Order placed successfully! Total: $${order.getTotal().toFixed(2)}`);
            } catch (error) {
                console.error("Error placing order:", error);
                alert("Failed to place order. Please try again.");
            }
        });

        // Initial display of orders
        this.displayOrders();
    }

    private async displayOrders(): Promise<void> {
        const ordersList = document.getElementById("ordersList") as HTMLUListElement;
        ordersList.innerHTML = "";

        try {
            const orders = await this.orderDAO.getAll();
            if (orders.length === 0) {
                ordersList.innerHTML = "<li>No orders yet</li>";
                return;
            }

            orders.forEach(order => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${order.getDescription()}</strong>
                    <span>$${order.getTotal().toFixed(2)}</span>
                    <small>${order.date.toLocaleString()}</small>
                `;
                ordersList.appendChild(li);
            });
        } catch (error) {
            console.error("Error fetching orders:", error);
            ordersList.innerHTML = "<li>Error loading orders</li>";
        }
    }

    private updateInventory(coffeeType: string, customizations: Customization[]): void {
        // Simplified inventory management
        // In a real app, we would have proper recipes for each coffee type
        try {
            this.inventoryManager.useIngredient("coffee_beans", 10); // 10g per coffee
            
            if (coffeeType === "latte" || coffeeType === "cappuccino") {
                this.inventoryManager.useIngredient("milk", 100); // 100ml for milk-based coffees
            }

            customizations.forEach(customization => {
                if (customization.getName() === "Milk") {
                    this.inventoryManager.useIngredient("milk", 50);
                } else if (customization.getName() === "Whipped Cream") {
                    this.inventoryManager.useIngredient("whipped_cream", 20);
                } else if (customization.getName() === "Sugar") {
                    this.inventoryManager.useIngredient("sugar", 5);
                }
            });
        } catch (error) {
            console.error("Inventory update error:", error);
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const app = new CoffeeShopApp();
    app.initialize();
}); 