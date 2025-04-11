export class InventoryManager {
    private static instance: InventoryManager;
    private inventory: Map<string, number> = new Map();

    private constructor() {
        // Initialize with some default ingredients
        this.inventory.set("coffee_beans", 1000); // grams
        this.inventory.set("milk", 5000); // ml
        this.inventory.set("sugar", 2000); // grams
        this.inventory.set("whipped_cream", 1000); // grams
    }

    public static getInstance(): InventoryManager {
        if (!InventoryManager.instance) {
            InventoryManager.instance = new InventoryManager();
        }
        return InventoryManager.instance;
    }

    public getInventory(): Map<string, number> {
        return new Map(this.inventory);
    }

    public useIngredient(name: string, amount: number): boolean {
        const currentAmount = this.inventory.get(name) || 0;
        if (currentAmount >= amount) {
            this.inventory.set(name, currentAmount - amount);
            return true;
        }
        return false;
    }

    public addIngredient(name: string, amount: number): void {
        const currentAmount = this.inventory.get(name) || 0;
        this.inventory.set(name, currentAmount + amount);
    }
}