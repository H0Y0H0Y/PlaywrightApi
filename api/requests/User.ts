import { APIResponse, APIRequestContext } from "@playwright/test";
import { IJSONValue } from "api/types/types";

export default class User {

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createUser(data: IJSONValue): Promise<APIResponse> {
        return this.request.post('/v2/user', { data: data });
    }

    async getUserByUsername(username: string): Promise<APIResponse> {
        return this.request.get(`/v2/user/${username}`);
    }

    async updateUserByUsername(username: string, data: IJSONValue): Promise<APIResponse> {
        return this.request.put(`/v2/user/${username}`, { data: data });
    }

    async deleteUserByUsername(username: string): Promise<APIResponse> {
        return this.request.delete(`/v2/user/${username}`);
    }

    async createUsersWithArray(data: IJSONValue[]): Promise<APIResponse> {
        return this.request.post('/v2/user/createWithArray', { data: data });
    }
}