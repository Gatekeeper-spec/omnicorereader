import { r as createServerFn } from "./ssr.mjs";
import { At as array, It as object, zt as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DYAJf2Iy.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Ci13LABp.js
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("1a751a46cd4d6ecca7ae7c1d2dd851f6e7fd31528a59ad5f9aa0d73436dced90"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	displayName: string().min(1).max(80),
	bio: string().max(280)
})).handler(createSsrRpc("ee204b84accba23daa557bd5874a20c059872c13312de5c401ceadb756fe579b"));
var deleteAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("a72cdc2925afb3deff7532faa088fc1ed5349c66eee402e239fb4c44c82f1cd8"));
var getMeStats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("803f9db2bcaa3f8852f1adc49ef69e4698fbf1ce0402404c93595d0aee2f0a3d"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ ids: array(string()).max(80) })).handler(createSsrRpc("0635fbf219e3baa0c26d989c4b28be8e75009418196fcf58e89b60cde6ad89bf"));
//#endregion
export { updateProfile as i, ensureProfile as n, getMeStats as r, deleteAccount as t };
