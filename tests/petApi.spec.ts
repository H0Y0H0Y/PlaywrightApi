import { faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { test } from 'fixtures';
import Pet from 'api/requests/Pet';

test.describe('User API', () => {
    test('successfully creates a pet', async ({ request }) => {
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
            status: faker.helpers.arrayElement(['available', 'pending', 'sold'])
        };
        const createPetResponse = await pet.createPet(data);
        const getPetResponse = await pet.getPetById(data.id);
        const getPetResponseJson = await getPetResponse.json();

        expect(createPetResponse.ok()).toBeTruthy();
        expect(getPetResponse.ok()).toBeTruthy();
        
        expect(getPetResponseJson.id).toBe(data.id);
        expect(getPetResponseJson.name).toBe(data.name);
        expect(getPetResponseJson.status).toBe(data.status);
        expect(getPetResponseJson.category.id).toBe(data.category.id);
        expect(getPetResponseJson.category.name).toBe(data.category.name);
        expect(getPetResponseJson.tags[0].id).toBe(data.tags[0].id);
        expect(getPetResponseJson.tags[0].name).toBe(data.tags[0].name);
        expect(getPetResponseJson.tags[1].id).toBe(data.tags[1].id);
        expect(getPetResponseJson.tags[1].name).toBe(data.tags[1].name);
    });

    test('successfully updates a pet', async ({ createPet, request }) => {

        const petId = createPet.petId;
        const pet = new Pet(request);
        const data = {
            id: petId,
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
            status: faker.helpers.arrayElement(['available', 'pending', 'sold'])
        };
        const updatePetResponse = await pet.updatePet(data);
        const getPetResponse = await pet.getPetById(petId);
        const getPetResponseJson = await getPetResponse.json();

        expect(updatePetResponse.ok()).toBeTruthy();
        expect(getPetResponse.ok()).toBeTruthy();
        
        expect(getPetResponseJson.id).toBe(data.id);
        expect(getPetResponseJson.name).toBe(data.name);
        expect(getPetResponseJson.status).toBe(data.status);
        expect(getPetResponseJson.category.id).toBe(data.category.id);
        expect(getPetResponseJson.category.name).toBe(data.category.name);
        expect(getPetResponseJson.tags[0].id).toBe(data.tags[0].id);
        expect(getPetResponseJson.tags[0].name).toBe(data.tags[0].name);
        expect(getPetResponseJson.tags[1].id).toBe(data.tags[1].id);
        expect(getPetResponseJson.tags[1].name).toBe(data.tags[1].name);
    });

    test('successfully deletes a pet', async ({ createPet, request }) => {

        const petId = createPet.petId;
        const pet = new Pet(request);
        const deletePetResponse = await pet.deletePet(petId);
        const getPetResponse = await pet.getPetById(petId);
        const getPetResponseJson = await getPetResponse.json();

        expect(deletePetResponse.ok()).toBeTruthy();
        expect(getPetResponse.ok()).toBeFalsy();
        expect(getPetResponseJson.type).toBe('error');
        expect(getPetResponseJson.message).toBe('Pet not found');
    });

    test('throws an error when deleting a pet that does not exist', async ({ deletedPet, request }) => {
        
        const pet = new Pet(request);
        const petId = deletedPet.petId;
        const deletePetResponse = await pet.deletePet(petId);

        expect(deletePetResponse.status()).toBe(404);
    });

    test('throws an error when getting a pet that does not exist', async ({ deletedPet, request }) => {
        
        const pet = new Pet(request);
        const petId = deletedPet.petId;
        const getPetResponse = await pet.getPetById(petId);

        expect(getPetResponse.status()).toBe(404);
    });
});