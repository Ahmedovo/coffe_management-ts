import { Coffee, Espresso, Latte, Cappuccino } from "../models/Coffee.js";

export class CoffeeFactory {
    public static createCoffee(type: string): Coffee {
        switch (type.toLowerCase()) {
            case "espresso":
                return new Espresso();
            case "latte":
                return new Latte();
            case "cappuccino":
                return new Cappuccino();
            default:
                throw new Error(`Unknown coffee type: ${type}`);
        }
    }
}