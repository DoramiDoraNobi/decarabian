<?php

namespace App\Services;

use App\Models\Tool;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class ProxyService
{
    /**
     * Forward a request to the target API with credential injection.
     *
     * @param Tool   $tool       The tool definition with target URL and method
     * @param array  $parameters The parameters sent by the agent
     * @return Response
     *
     * @throws ConnectionException
     */
    public function forward(Tool $tool, array $parameters = []): Response
    {
        $credential = $tool->credential;
        $realSecret = $credential->decrypted_secret;

        // Build the HTTP client with appropriate auth
        // Disable SSL verify in local/dev environment for easier testing
        $client = Http::timeout(30)
                      ->connectTimeout(10)
                      ->acceptJson();

        if (app()->environment('local', 'testing')) {
            $client = $client->withoutVerifying();
        }

        $client = $this->injectCredential($client, $credential, $realSecret);

        // Inject path variables from parameters into the URL (e.g. {owner}/{repo})
        $method = strtoupper($tool->http_method);
        $url = $tool->target_url;
        
        foreach ($parameters as $key => $value) {
            if (is_scalar($value) && str_contains($url, '{' . $key . '}')) {
                $url = str_replace('{' . $key . '}', urlencode((string)$value), $url);
                unset($parameters[$key]); // Remove from body/query since it's in the URL
            }
        }

        // GitHub API and most modern APIs prefer JSON bodies, not Form Data
        // so we switch to asJson() for write operations.
        return match ($method) {
            'GET'    => $client->get($url, $parameters),
            'POST'   => $client->asJson()->post($url, $parameters),
            'PUT'    => $client->asJson()->put($url, $parameters),
            'PATCH'  => $client->asJson()->patch($url, $parameters),
            'DELETE' => $client->delete($url, $parameters),
            default  => $client->asJson()->post($url, $parameters),
        };
    }

    /**
     * Inject the credential into the HTTP client based on auth_type.
     *
     * Supports:
     * - bearer: Authorization: Bearer <token>
     * - header: Custom header name with the secret as value
     * - query:  Appends the secret as a query parameter
     */
    protected function injectCredential($client, $credential, string $secret)
    {
        return match ($credential->auth_type) {
            'bearer' => $client->withToken($secret),

            'header' => $client->withHeaders([
                $credential->auth_header_name ?? 'X-API-Key' => $secret,
            ]),

            'query' => $client->withQueryParameters([
                $credential->auth_header_name ?? 'api_key' => $secret,
            ]),

            default => $client->withToken($secret),
        };
    }
}
