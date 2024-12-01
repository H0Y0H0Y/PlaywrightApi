import { APIResponse, APIRequestContext } from "@playwright/test";
import { IJSONValue } from "api/types/types";

export default class Pet {

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createPet(data: IJSONValue): Promise<APIResponse> {
        return this.request.post('/v2/pet', { data: data });
    }

    async getPetById(petId: number): Promise<APIResponse> {
        return this.request.get(`/v2/pet/${petId}`);
    }

    async updatePet(data: IJSONValue): Promise<APIResponse> {
        return this.request.put('/v2/pet', { data: data });
    }

    async deletePet(petId: number): Promise<APIResponse> {
        return this.request.delete(`/v2/pet/${petId}`);
    }
}