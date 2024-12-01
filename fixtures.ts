import { faker } from '@faker-js/faker';
import { test as base } from '@playwright/test';
import Order from 'api/requests/Order';
import Pet from 'api/requests/Pet';
import User from 'api/requests/User';

type FixturesType = {
    createUser: {
        userName: string;
    },
    deletedUser: {
        userName: string;
    },
    createPet: {
        petId: number;
    },
    deletedPet: {
        petId: number;
    },
    createOrder: {
        orderId: number;
    },
    deletedOrder: {
        orderId: number;
    }
}

export const test = base.extend<FixturesType>({
    createUser: async ({ request }, use) => {
        const user = new User(request);
        const id = parseInt(faker.string.numeric(10));
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const userName = faker.internet.username({ firstName: firstName, lastName: lastName });
        const data = {
            id: id,
            username: userName,
            firstName: firstName,
            lastName: lastName,
            email: faker.internet.email({  firstName: firstName, lastName: lastName }),
            password: "password",
            phone: "0831043223",
            userStatus: 0
        };
        await user.createUser(data);
        await use({ userName });
    },
    deletedUser: async ({ createUser, request }, use) => {
        const user = new User(request);
        const userName = createUser.userName;
        await user.deleteUserByUsername(userName);
        await use({ userName });
    },
    createPet: async ({ request }, use) => {
        const pet = new Pet(request);
        const data = {
            id: parseInt(faker.string.numeric(10)),
            category: {
                id: parseInt(faker.string.numeric(10)),
                name: faker.helpers.arrayElement(['cat1', 'cat2', 'cat3', 'cat4', 'cat5'])
            },
            name: faker.person.firstName(),
            tags: [
                {
                    id: parseInt(faker.string.numeric(10)),
                    name: faker.word.adjective()
                },
                {
                    id: parseInt(faker.string.numeric(10)),
                    name: faker.word.adjective()
                }
            ],
            status: 'available'
        };
        await pet.createPet(data);
        const petId = data.id;
        await use({ petId });
    },
    deletedPet: async ({ createPet, request }, use) => {
        const pet = new Pet(request);
        const petId = createPet.petId;
        await pet.deletePet(petId);
        await use({ petId });
    },
    createOrder: async ({ request }, use) => {
        const order = new Order(request);
        const data = {
            id: parseInt(faker.string.numeric(10)),
            petId: parseInt(faker.string.numeric(10)),
            quantity: parseInt(faker.string.numeric(2)),
            shipDate: faker.date.recent(),
            status: 'placed',
            complete: true
        };
        await order.createOrder(data);
        const orderId = data.id;
        await use({ orderId });
    },
    deletedOrder: async ({ createOrder, request }, use) => {
        const order = new Order(request);
        const orderId = createOrder.orderId;
        await order.deleteOrder(orderId);
        await use({ orderId });
    }
})