export abstract class Coffee {
    protected description: string;
    protected basePrice: number;

    constructor(description: string, basePrice: number) {
        this.description = description;
        this.basePrice = basePrice;
    }

    public getDescription(): string {
        return this.description;
    }

    public getPrice(): number {
        return this.basePrice;
    }
}

export class Espresso extends Coffee {
    constructor() {
        super("Espresso", 3.50);
    }
}

export class Latte extends Coffee {
    constructor() {
        super("Latte", 4.00);
    }
}

export class Cappuccino extends Coffee {
    constructor() {
        super("Cappuccino", 4.50);
    }
}