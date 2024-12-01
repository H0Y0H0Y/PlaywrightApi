import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { test } from 'fixtures';
import Order from 'api/requests/Order';

test.describe('Order API', () => {
    test('successfully creates an order', async ({ request }) => {
        const order = new Order(request);
        const data = {
            id: parseInt(faker.string.numeric(10)),
            petId: parseInt(faker.string.numeric(10)),
            quantity: parseInt(faker.string.numeric(2)),
            shipDate: faker.date.recent(),
            status: 'placed',
            complete: true
        };
        const createOrderResponse = await order.createOrder(data);
        const getOrderResponse = await order.getOrderById(data.id);
        const getOrderResponseJson = await getOrderResponse.json();

        expect(createOrderResponse.ok()).toBeTruthy();
        expect(getOrderResponse.ok()).toBeTruthy();
        
        expect(getOrderResponseJson.id).toBe(data.id);
        expect(getOrderResponseJson.petId).toBe(data.petId);
        expect(getOrderResponseJson.quantity).toBe(data.quantity);
        expect(getOrderResponseJson.shipDate).toBe(data.shipDate.toISOString().replace('Z', '+0000'));
        expect(getOrderResponseJson.status).toBe(data.status);
        expect(getOrderResponseJson.complete).toBe(data.complete);
    });

    test('successfully deletes an order', async ({ createOrder, request }) => {

        const orderId = createOrder.orderId;
        const order = new Order(request);
        const deleteOrderResponse = await order.deleteOrder(orderId);
        const getOrderResponse = await order.getOrderById(orderId);
        const getOrderResponseJson = await getOrderResponse.json();

        expect(deleteOrderResponse.ok()).toBeTruthy();
        expect(getOrderResponse.ok()).toBeFalsy();
        expect(getOrderResponse.status()).toBe(404);
        expect(getOrderResponseJson.type).toBe('error');
        expect(getOrderResponseJson.message).toBe('Order not found');
    });

    test('throws an error when deleting an order that does not exist', async ({ deletedOrder, request }) => {

        const order = new Order(request);
        const orderId = deletedOrder.orderId;
        const deleteOrderResponse = await order.deleteOrder(orderId);

        expect(deleteOrderResponse.status()).toBe(404);
    });

    test('throws an error when getting an order that does not exist', async ({ deletedOrder, request }) => {
        
        const order = new Order(request);
        const orderId = deletedOrder.orderId;
        const getOrderResponse = await order.getOrderById(orderId);

        expect(getOrderResponse.status()).toBe(404);
    });
});