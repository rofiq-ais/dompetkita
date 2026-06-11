import { onRequestDelete as __api_transactions_js_onRequestDelete } from "/home/rofiq-ais/Project/Dompetkita/functions/api/transactions.js"
import { onRequestGet as __api_transactions_js_onRequestGet } from "/home/rofiq-ais/Project/Dompetkita/functions/api/transactions.js"
import { onRequestPost as __api_transactions_js_onRequestPost } from "/home/rofiq-ais/Project/Dompetkita/functions/api/transactions.js"
import { onRequestPut as __api_transactions_js_onRequestPut } from "/home/rofiq-ais/Project/Dompetkita/functions/api/transactions.js"

export const routes = [
    {
      routePath: "/api/transactions",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_transactions_js_onRequestDelete],
    },
  {
      routePath: "/api/transactions",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_transactions_js_onRequestGet],
    },
  {
      routePath: "/api/transactions",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_transactions_js_onRequestPost],
    },
  {
      routePath: "/api/transactions",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_transactions_js_onRequestPut],
    },
  ]