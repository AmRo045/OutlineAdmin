@extends('layouts.app')

@section('content')
    <section class="mt-5 px-1 px-lg-5">
        <header>
            <h2>{{ __('Add Outline Server') }}</h2>
        </header>

        <section class="d-grid gap-3 mt-3">
            <section>
                <h4 class="mt-1">Follow the instructions below</h4>
                <p>These steps will help you install Outline on a Linux server.</p>
                <p>Log into your server, and run this command.</p>
            </section>

            <section>
                <h3 class="mt-2">{{ __('New Server') }}</h3>
                <div class="mt-2"><code>{{ config('outline.setup_script') }}</code></div>


                <h3 class="mt-4">{{ __('Existing Server') }}</h3>
                <div class="mt-2"><code>{{ config('outline.existing_server_script') }}</code></div>

                <section class="mt-4">
                    <div>Paste your installation output here.</div>
                    <form action="{{ route('servers.store') }}" method="post">
                        @csrf

                        <section>
                            <input
                                class="d-block w-100"
                                value="{{ old('api_url_and_cert_sha256') }}"
                                name="api_url_and_cert_sha256"
                                placeholder="{{ config('outline.setup_script_output_example') }}"
                                required>
                            @error('api_url_and_cert_sha256')
                            <smal class="error-message">{{ $message }}</smal>
                            @enderror
                        </section>

                        <section class="d-flex justify-content-between gap-2 mt-3">
                            <button class="btn btn-primary">{{ __('Add') }}</button>
                            <a href="{{ route('servers.index') }}" class="btn btn-light">{{ __('Cancel') }}</a>
                        </section>
                    </form>
                </section>
            </section>
        </section>
    </section>

@endsection
