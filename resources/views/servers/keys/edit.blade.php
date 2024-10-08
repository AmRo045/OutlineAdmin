@php use App\Enums\DataLimitUnit; @endphp
@extends('layouts.app')

@section('content')
    <section class="mt-5 px-1 px-lg-5">
        <div class="d-flex align-items-center gap-2">
            <a class="btn btn-tool" href="{{ route('servers.keys.index', $server->id) }}">
                <x-svg.arrow-left width="20" height="20"/>
            </a>
            <h2>{{ __('Editing :key', ['key' => $key->name]) }}</h2>
        </div>

        <form action="{{ route('servers.keys.update', [$server->id, $key->id]) }}" method="post">
            @csrf
            @method('PATCH')

            <section class="d-grid gap-3 my-3">
                <section>
                    <label for="name" class="ps-1 mb-1">{{ __('Name') }}</label>
                    <input class="d-block" id="name" name="name" required value="{{ old('name', $key->name) }}"
                           autofocus>
                    @error('name')<small class="ps-1 error-message">{{ $message }}</small>@enderror
                </section>

                <section>
                    <div class="d-flex gap-2 align-items-center">
                        <div>
                            <label for="data_limit" class="ps-1 mb-1">{{ __('Data limit') }}</label>
                            <input class="d-block" id="data_limit" type="number" name="data_limit"
                                   value="{{ old('data_limit', $key->data_limit) }}" placeholder="Data limit">
                        </div>

                        <div>
                            <label for="data_limit_unit" class="ps-1 mb-1">{{ __('Unit') }}</label>
                            <select class="d-block" id="data_limit_unit" name="data_limit_unit">
                                @foreach(DataLimitUnit::cases() as $unit)
                                    <option
                                        value="{{ $unit->value }}" @selected(old('data_limit_unit', $key->data_limit_unit->value) == $unit->value)>{{ __($unit->name) }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    @error('data_limit')<small class="ps-1 error-message">{{ $message }}</small>@enderror
                    @error('data_limit_unit')<small class="ps-1 error-message">{{ $message }}</small>@enderror
                </section>

                <section>
                    <label for="expires_at" class="ps-1 mb-1">{{ __('Expiration date') }}</label>
                    <input class="d-block" id="expires_at" type="datetime-local" name="expires_at"
                           value="{{ old('expires_at', $key->expires_at?->format('Y-m-d\TH:i')) }}"
                           min="{{ now()->format('Y-m-d\TH:i') }}">
                    @error('expires_at')<small class="ps-1 error-message">{{ $message }}</small>@enderror
                </section>
            </section>

            <button class="btn btn-primary">{{ __('Update') }}</button>
        </form>
    </section>
@endsection
