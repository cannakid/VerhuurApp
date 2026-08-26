export default interface Appliance {
    id: string;
    userId : string;
    ownerName: string
    description: string;
    category: string;
    url: string;
    price: number;
    available: boolean;
}