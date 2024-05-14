enum PhoneModel {
    'iphonex',
    'iphone11',
    'iphone12',
    'iphone13',
    'iphone14',
    'iphone15'
}

enum CaseMaterial {
    'silicone',
    'polycarbonate'
}

enum CaseFinish {
    'smooth',
    'textured'
}

export enum CaseColor {
    'black',
    'blue',
    'rose'
}

export type Configuration = {
    id: string,
    width: number,
    height: number,
    imageUrl: string,
    color: CaseColor,
    model: PhoneModel,
    material: CaseMaterial,
    finish: CaseFinish,
    croppedImageUrl: string,
    Order: Order[]
}

type User = {
    id: string,
    email: string,
    Order: Order[],
    createdAt: Date,
    updatedAt: Date
}

enum OrderStatus {
    'fulfilled',
    'shipped',
    'awaiting_shipment'
}

export type Order = {
    id: string,
    configurationId: string,
    configuration: Configuration,
    user: User,
    userId: string,
    amount: number,
    isPaid: boolean,
    status: OrderStatus,
    shippingAddress: ShippingAddress,
    shippingAddressId: String,
    billingAddress: BillingAddress,
    billingAddressId: string
    createdAt: Date,
    updated: Date
}

export type ShippingAddress = {
    id: string,
    name: string,
    street: string,
    city: string,
    postalCode: string,
    country: string
    state: string,
    phoneNumber: string,
    orders: Order[]
}

type BillingAddress = {
    id: string,
    name: string,
    street: string,
    city: string,
    postalCode: string,
    country: string,
    state: string,
    phoneNumber: string
    orders: Order[]
}