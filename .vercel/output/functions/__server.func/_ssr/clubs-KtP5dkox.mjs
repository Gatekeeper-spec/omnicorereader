import { r as SELECTION_MODES, t as FORMATS } from "./formats-jvG5fuHm.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { Ft as number, It as object, Ot as _enum, jt as boolean, zt as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-DYAJf2Iy.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clubs-KtP5dkox.js
var formatZ = _enum(FORMATS);
var listClubs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7c7ed9717b30da7b421697898a7a6e45a4d29ddcf0f9897c3d445a259c08bb82"));
var getClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(createSsrRpc("1820012bb513593ab8cd23a2190a3fdde689eeca4380f2a75b03967dbcd05cbd"));
var createClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	name: string().min(2).max(80),
	description: string().max(400).optional(),
	selectionMode: _enum(SELECTION_MODES).optional()
})).handler(createSsrRpc("33bc0ae011531051774597bc32bb6d2f12beb1c2a161411eac0a42eb6a33c109"));
var joinClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ code: string().min(4).max(12) })).handler(createSsrRpc("2d05fd06c58a5da9b8d64358f2c79d9cc3eeedd981c98b981cb56b1667bf7164"));
var updateClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	name: string().min(2).max(80),
	description: string().max(400),
	selectionMode: _enum(SELECTION_MODES),
	memberLimit: number().int().min(2).max(200)
})).handler(createSsrRpc("a69734995c28603ba7ae6635657e3b335564416ba0a79478272694dbd08de922"));
var leaveClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(createSsrRpc("9356e44ef07d97fc831beec9f9ac77fd131c0903cbb81995d20fb46b32d8f661"));
var deleteClub = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(createSsrRpc("86815f8db08447780cb193dffd12b0baef5115c29f596dff5e9d930becab5b37"));
var listMembers = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(createSsrRpc("284582f91fefaf74dbca8c0325b742e120907df4eaaaad5b191b18ffb6d52401"));
var listWorks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(createSsrRpc("b40aaae1121277975fe5a1c5d354a7aec786c3efcaa75c7deb9d715b15f008fa"));
var nominateWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	title: string().min(1).max(200),
	author: string().max(160).optional(),
	coverUrl: string().max(500).optional(),
	isbn: string().max(32).optional(),
	format: formatZ,
	totalUnits: number().int().min(0).max(1e5).optional(),
	synopsis: string().max(800).optional()
})).handler(createSsrRpc("47b56108586e5a3ce1b8d2b6d079304e5d22461dc4bceb427dc5fb8e52018a4a"));
var toggleVote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string()
})).handler(createSsrRpc("84288a4ee574f732cd45b71116eee9efcf8e83411fb2ac8f042d6d9fda8ba0da"));
var setCurrentWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string()
})).handler(createSsrRpc("27fc39987348c8a6eb28c144c1f2ef5bac32d5bcb822bc97acc94ca6e15cf6c8"));
var raffleWork = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(createSsrRpc("83d654a47dae7dd4d8be38c5d3459d8760eea5e2d2aa9f930d47609adabdc8e9"));
var closeVote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(createSsrRpc("0b391d14b00e90956a5b6f7fd6bf3828c09db3c8eb76693628f311e569157ad3"));
var listClubProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string()
})).handler(createSsrRpc("b45808fe7966cd16774d9749047ff38032b909a4640a200b3c7f82ac910d6ecc"));
var updateClubProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string(),
	progress: number().int().min(0).max(1e5)
})).handler(createSsrRpc("672b49549634b613160750fd8624d8aa904840bd7d420850eb29af999f602c65"));
var listPosts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ clubId: string() })).handler(createSsrRpc("c15b4c7a02485923220ecb171e0e6eed1f78b14940ec715e9546aac0c6e47894"));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	clubId: string(),
	workId: string().nullable().optional(),
	body: string().min(1).max(2e3),
	spoiler: boolean().optional()
})).handler(createSsrRpc("a72df6192e80ea9f220f3af725b4f3cee7fadd76b5052b98e8476e91fe8ac92d"));
//#endregion
export { updateClub as _, getClub as a, listClubProgress as c, listPosts as d, listWorks as f, toggleVote as g, setCurrentWork as h, deleteClub as i, listClubs as l, raffleWork as m, createClub as n, joinClub as o, nominateWork as p, createPost as r, leaveClub as s, closeVote as t, listMembers as u, updateClubProgress as v };
