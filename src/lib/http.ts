/**
 * Cliente Axios simples para requisições HTTP.
 * Vamos precisar dele para fazer chamadas à API do Gemini, na futura integração de chatbot.
 * Poderemos possivelmente utilizar o mesmo cliente para outras APIs, como a do Amplify.
 *
 * @see https://axios-http.com/docs/intro
 */

import axios from 'axios';

export const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })
