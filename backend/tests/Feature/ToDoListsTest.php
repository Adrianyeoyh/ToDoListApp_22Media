<?php

use App\Models\Todo;
use App\Models\TodoList;

test('a todo list can be created with only a name', function () {
    $response = $this->postJson('/api/todo-lists', ['name' => 'Groceries']);

    $response->assertCreated()
        ->assertJsonPath('name', 'Groceries')
        ->assertJsonPath('todos', [])
        ->assertJsonStructure(['id', 'name', 'created_at', 'updated_at', 'todos']);

    $this->assertDatabaseHas('todo_lists', ['name' => 'Groceries']);
});

test('creating a todo list requires a name', function () {
    $this->postJson('/api/todo-lists', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
});

test('creating a todo list ignores client supplied ids', function () {
    $response = $this->postJson('/api/todo-lists', ['id' => 999, 'name' => 'Groceries']);

    $response->assertCreated();

    expect($response->json('id'))->not->toBe(999);
});

test('todo lists are listed with their todos', function () {
    $list = TodoList::create(['name' => 'Groceries']);
    Todo::create(['description' => 'Milk', 'todo_list_id' => $list->id]);

    $this->getJson('/api/todo-lists')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.name', 'Groceries')
        ->assertJsonPath('0.todos.0.description', 'Milk')
        ->assertJsonPath('0.todos.0.is_done', false);
});

test('a todo list can be shown by id', function () {
    $list = TodoList::create(['name' => 'Groceries']);
    Todo::create(['description' => 'Milk', 'todo_list_id' => $list->id]);

    $this->getJson("/api/todo-lists/{$list->id}")
        ->assertOk()
        ->assertJsonPath('id', $list->id)
        ->assertJsonPath('todos.0.description', 'Milk');
});

test('showing a missing todo list returns not found', function () {
    $this->getJson('/api/todo-lists/999')->assertNotFound();
});

test('a todo list name can be updated', function () {
    $list = TodoList::create(['name' => 'Groceries']);

    $this->putJson("/api/todo-lists/{$list->id}", ['name' => 'Shopping'])
        ->assertOk()
        ->assertJsonPath('name', 'Shopping');

    expect($list->fresh()->name)->toBe('Shopping');
});

test('updating a todo list requires a name', function () {
    $list = TodoList::create(['name' => 'Groceries']);

    $this->putJson("/api/todo-lists/{$list->id}", [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
});

test('a todo list and its todos can be deleted', function () {
    $list = TodoList::create(['name' => 'Groceries']);
    Todo::create(['description' => 'Milk', 'todo_list_id' => $list->id]);

    $this->deleteJson("/api/todo-lists/{$list->id}")->assertNoContent();

    $this->assertDatabaseMissing('todo_lists', ['id' => $list->id]);
    $this->assertDatabaseMissing('todos', ['todo_list_id' => $list->id]);
});
