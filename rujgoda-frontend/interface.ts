export interface Hotel {
    _id: string,
    name: string,
    province: string,
    tel: string,
    id: string
}

export interface Favorites {
    _id: string,
    user: string,
    hotel: Hotel
    createdAt: Date,
}

export interface User{
    _id: string,
    name: string,
    email: string,
    tel: string,
    role: string,
    createdAt: Date,
}
