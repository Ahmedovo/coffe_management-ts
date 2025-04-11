export class Customization {
    constructor(private name: string, private price: number) {}

    public getName(): string {
        return this.name;
    }

    public getPrice(): number {
        return this.price;
    }
}