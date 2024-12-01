import { APIResponse, APIRequestContext } from "@playwright/test";
import { IJSONValue } from "api/types/types";

export default class Order {
    
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createOrder(data: IJSONValue): Promise<APIResponse> {
        return this.request.post('/v2/store/order', { data: data });
    }

    async getOrderById(orderId: number): Promise<APIResponse> {
        return this.request.get(`/v2/store/order/${orderId}`);
    }

    async deleteOrder(orderId: number): Promise<APIResponse> {
        return this.request.delete(`/v2/store/order/${orderId}`);
    }
}