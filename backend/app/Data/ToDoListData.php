<?php

namespace App\Data;

use Illuminate\Support\Carbon;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Output shape of a todo list returned by the API.
 */
class ToDoListData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public Carbon $created_at,
        public Carbon $updated_at,

        /** @var array<int, ToDoData> */
        #[DataCollectionOf(ToDoData::class)]
        public array $todos,
    ) {}
}
