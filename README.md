# see my sound
a [Spotify](https://developer.spotify.com/) powered application

## how the authentication works

the information below was pulled from the Spotify tutorial, [Display your Spotify profile data in a web app](https://developer.spotify.com/documentation/web-api/howtos/web-app-profile)

- when the page loads, we'll check if ther eis a code in the callback query string
- if we don't have a code, we'll redirect the user to the Spotify authorization page
- once the user authorizes the application, Spotify will redirect the user back to our application, and we'll read the code from the query string
- we'll use the code to request an access token from the Spotify token API
- we'll use the access token to call the Web API to get the user's profile data
- we'll populate the user interface with user's profile data

## calling the Web API

we're going to use the Web API to get the user's profile data. we'll use the [authorization code flow with PKCE](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow) to get an access token and then use that token to call the API

### authorization code with PKCE Flow

the implementation of the PKCE extension consists of the following steps
- [Code Challenge](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-challenge) generation from a [Code Verifier](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#code-verifier)
- [Request authorization](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-user-authorization) from the user and retrieve the authorization code
- [Request an access token](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow#request-an-access-token) from the authorization code
