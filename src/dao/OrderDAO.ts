import { CoffeeFactory } from "../factories/CoffeeFactory.js";
import { Customization } from "../models/Customization.js";
import { Order } from "../models/Order.js";
import { IndexedDBDatabase } from "./Database.js";

export class OrderDAO {
    private db: IndexedDBDatabase;

    constructor(db: IndexedDBDatabase) {
        this.db = db;
    }

    public async save(order: Order): Promise<void> {
        return new Promise((resolve, reject) => {
            const store = this.db.getOrdersStore("readwrite");
            const request = store.put({
                id: order.id,
                coffee: {
                    description: order.coffee.getDescription(),
                    basePrice: order.coffee.getPrice(),
                    type: order.coffee.constructor.name
                },
                customizations: order.customizations.map(c => ({
                    name: c.getName(),
                    price: c.getPrice()
                })),
                date: order.date
            });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error("Failed to save order"));
        });
    }

    public async getAll(): Promise<Order[]> {
        return new Promise((resolve, reject) => {
            const store = this.db.getOrdersStore();
            const request = store.getAll();

            request.onsuccess = () => {
                const ordersData = request.result;
                const orders = ordersData.map(data => {
                    const coffee = CoffeeFactory.createCoffee(data.coffee.type);
                    const customizations = data.customizations.map(
                        (c: any) => new Customization(c.name, c.price)
                    );
                    return new Order(
                        coffee,
                        customizations,
                        data.id,
                        new Date(data.date)
                    );
                });
                resolve(orders);
            };

            request.onerror = () => reject(new Error("Failed to get orders"));
        });
    }
}