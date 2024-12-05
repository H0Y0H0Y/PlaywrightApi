import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { test } from 'fixtures';
import User from 'api/requests/User';
import { createUserSchema } from 'api/schemas/User.schema';

test.describe('User API', () => {

    test('successfully creates a user', async ({ request }) => {
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
        // const response = await request.post('/v2/user', { data: data });
        const createUserResponse = await user.createUser(data);
        const createUserResponseJson = await createUserResponse.json();
        const getUserResponse = await user.getUserByUsername(userName);
        const getUserResponseJson = await getUserResponse.json();

        expect(createUserResponse.ok()).toBeTruthy();
        expect(getUserResponse.ok()).toBeTruthy();
        
        expect(getUserResponseJson.id).toBe(id);
        expect(getUserResponseJson.username).toBe(userName);
        expect(getUserResponseJson.firstName).toBe(firstName);
        expect(getUserResponseJson.lastName).toBe(lastName);
        expect(getUserResponseJson.email).toBe(data.email);
        expect(getUserResponseJson.password).toBe(data.password);
        expect(getUserResponseJson.phone).toBe(data.phone);
        expect(getUserResponseJson.userStatus).toBe(data.userStatus);

        // Schema validation
        expect(() => createUserSchema.parse(createUserResponseJson)).not.toThrow();
    });

    test('successfully updates a user', async ({ createUser, request }) => {

        const userName = createUser.userName;
        const user = new User(request);
        const data = {
            id: 1,
            username: userName,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: "password",
            phone: "0831043223",
            userStatus: 0
        };
        const updateUserResponse = await user.updateUserByUsername(userName, data);
        const getUserResponse = await user.getUserByUsername(userName);
        const getUserResponseJson = await getUserResponse.json();

        expect(updateUserResponse.ok()).toBeTruthy();
        expect(getUserResponse.ok()).toBeTruthy();
        
        expect(getUserResponseJson.id).toBe(data.id);
        expect(getUserResponseJson.username).toBe(userName);
        expect(getUserResponseJson.firstName).toBe(data.firstName);
        expect(getUserResponseJson.lastName).toBe(data.lastName);
        expect(getUserResponseJson.email).toBe(data.email);
        expect(getUserResponseJson.password).toBe(data.password);
        expect(getUserResponseJson.phone).toBe(data.phone);
        expect(getUserResponseJson.userStatus).toBe(data.userStatus);
    });

    test('successfully deletes a user', async ({ createUser, request }) => {

        const userName = createUser.userName;
        const user = new User(request);
        const deleteUserResponse = await user.deleteUserByUsername(userName);
        const getUserResponse = await user.getUserByUsername(userName);
        const getUserResponseJson = await getUserResponse.json();

        expect(deleteUserResponse.ok()).toBeTruthy();
        expect(getUserResponse.ok()).toBeFalsy();
        expect(getUserResponseJson.type).toBe('error');
        expect(getUserResponseJson.message).toBe('User not found');
    });

    test('throws an error when deleting a user that does not exist', async ({ deletedUser, request }) => {

        const user = new User(request);
        const userName = deletedUser.userName;
        const deleteUserResponse = await user.deleteUserByUsername(userName);

        expect(deleteUserResponse.status()).toBe(404);
    });

    test('throws an error when getting a user that does not exist', async ({ deletedUser, request }) => {
            
            const user = new User(request);
            const userName = deletedUser.userName;
            const getUserResponse = await user.getUserByUsername(userName);
    
            expect(getUserResponse.status()).toBe(404);
    });

    test('successfully creates users with an array', async ({ request }) => {

        const user = new User(request);
        const id1 = parseInt(faker.string.numeric(10));
        const id2 = parseInt(faker.string.numeric(10));
        const firstName1 = faker.person.firstName();
        const lastName1 = faker.person.lastName();
        const userName1 = faker.internet.username({ firstName: firstName1, lastName: lastName1 });
        const firstName2 = faker.person.firstName();
        const lastName2 = faker.person.lastName();
        const userName2 = faker.internet.username({ firstName: firstName2, lastName: lastName2 });
        const data = [
            {
                id: id1,
                username: userName1,
                firstName: firstName1,
                lastName: lastName1,
                email: faker.internet.email({  firstName: firstName1, lastName: lastName1 }),
                password: "password",
                phone: "0831043223",
                userStatus: 0
            },
            {
                id: id2,
                username: userName2,
                firstName: firstName2,
                lastName: lastName2,
                email: faker.internet.email({  firstName: firstName2, lastName: lastName2 }),
                password: "password",
                phone: "0831043223",
                userStatus: 0
            }
        ];
        const createUsersWithArrayResponse = await user.createUsersWithArray(data);
        const getUserResponse1 = await user.getUserByUsername(userName1);
        const getUserResponseJson1 = await getUserResponse1.json();
        const getUserResponse2 = await user.getUserByUsername(userName2);
        const getUserResponseJson2 = await getUserResponse2.json();

        expect(createUsersWithArrayResponse.ok()).toBeTruthy();
        expect(getUserResponse1.ok()).toBeTruthy();
        expect(getUserResponse2.ok()).toBeTruthy();
        
        expect(getUserResponseJson1.id).toBe(id1);
        expect(getUserResponseJson1.username).toBe(userName1);
        expect(getUserResponseJson1.firstName).toBe(firstName1);
        expect(getUserResponseJson1.lastName).toBe(lastName1);
        expect(getUserResponseJson1.email).toBe(data[0].email);
        expect(getUserResponseJson1.password).toBe(data[0].password);
        expect(getUserResponseJson1.phone).toBe(data[0].phone);
        expect(getUserResponseJson1.userStatus).toBe(data[0].userStatus);

        expect(getUserResponseJson2.id).toBe(id2);
        expect(getUserResponseJson2.username).toBe(userName2);
        expect(getUserResponseJson2.firstName).toBe(firstName2);
        expect(getUserResponseJson2.lastName).toBe(lastName2);
        expect(getUserResponseJson2.email).toBe(data[1].email);
        expect(getUserResponseJson2.password).toBe(data[1].password);
        expect(getUserResponseJson2.phone).toBe(data[1].phone);
        expect(getUserResponseJson2.userStatus).toBe(data[1].userStatus);
    });

});