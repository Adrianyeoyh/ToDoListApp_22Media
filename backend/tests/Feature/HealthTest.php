<?php

it('reports ok when the database is reachable', function () {
    $this->getJson('/api/health')
        ->assertOk()
        ->assertExactJson(['status' => 'ok']);
});

it('reports unavailable when the database cannot be reached', function () {
    $originalConnection = config('database.default');

    config([
        'database.connections.unreachable' => [
            'driver' => 'pgsql',
            'host' => '127.0.0.1',
            'port' => 1,
            'database' => 'missing',
            'username' => 'missing',
            'password' => '',
        ],
        'database.default' => 'unreachable',
    ]);

    $this->getJson('/api/health')
        ->assertServiceUnavailable()
        ->assertExactJson(['status' => 'unavailable']);

    config(['database.default' => $originalConnection]);
});
