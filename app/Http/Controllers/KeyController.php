<?php

namespace App\Http\Controllers;

use App\Enums\DataLimitUnit;
use App\Models\AccessKey;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class KeyController extends Controller
{
    public function index(Request $request, Server $server)
    {
        // TODO: sync the existing keys
        $keys = $server->keys()->latest()->simplePaginate($request->per_page ?? 25);
        $server->loadCount('keys');

        return view('servers.keys.index', compact('server', 'keys'));

    }

    public function store(Request $request, Server $server)
    {
        if (! $server->is_available) {
            return redirect()->route('servers.index');
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:64',
            'data_limit_unit' => ['required', Rule::enum(DataLimitUnit::class)],
            'data_limit' => 'nullable|numeric|min:0|max:1000000000000000000',
            'expires_at' => 'nullable|date_format:Y-m-d\TH:i',
        ]);

        DB::transaction(function () use ($server, $validatedData) {
            $server->keys()->create($validatedData);
        });

        return redirect()->route('servers.keys.index', $server->id);
    }

    public function create(Server $server)
    {
        if (! $server->is_available) {
            return redirect()->route('servers.index');
        }

        return view('servers.keys.create', compact('server'));
    }

    public function edit(Server $server, AccessKey $key)
    {
        if (! $server->is_available) {
            return redirect()->route('servers.index');
        }

        return view('servers.keys.edit', compact('server', 'key'));
    }

    public function update(Request $request, Server $server, AccessKey $key)
    {
        if (! $server->is_available) {
            return redirect()->route('servers.index');
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:64',
            'data_limit_unit' => ['required', Rule::enum(DataLimitUnit::class)],
            'data_limit' => 'nullable|numeric|min:0|max:1000000000000000000',
            'expires_at' => 'nullable|date_format:Y-m-d\TH:i',
        ]);

        DB::transaction(function () use ($key, $validatedData) {
            $key->update($validatedData);
        });

        return redirect()->route('servers.keys.index', $server->id);
    }

    public function destroy(Server $server, AccessKey $key)
    {
        if (! $server->is_available) {
            return redirect()->route('servers.index');
        }

        DB::transaction(function () use ($server, $key) {
            $server->keys()->find($key->id)->delete();
        });

        return redirect()->route('servers.keys.index', $server->id);
    }
}
