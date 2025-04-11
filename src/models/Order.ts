import { Coffee } from "./Coffee.js";
import { Customization } from "./Customization.js";

export class Order {
    public id: string;
    public date: Date;

    constructor(
        public coffee: Coffee,
        public customizations: Customization[] = [],
        id?: string,
        date?: Date
    ) {
        this.id = id || crypto.randomUUID();
        this.date = date || new Date();
    }

    public getTotal(): number {
        const coffeePrice = this.coffee.getPrice();
        const customizationsPrice = this.customizations.reduce(
            (sum, customization) => sum + customization.getPrice(),
            0
        );
        return coffeePrice + customizationsPrice;
    }

    public getDescription(): string {
        const coffeeDesc = this.coffee.getDescription();
        const customizationsDesc = this.customizations
            .map(c => c.getName())
            .join(", ");
        
        return customizationsDesc 
            ? `${coffeeDesc} with ${customizationsDesc}`
            : coffeeDesc;
    }
}