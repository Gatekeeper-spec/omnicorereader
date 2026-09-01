//#region node_modules/.nitro/vite/services/ssr/assets/formats-jvG5fuHm.js
var FORMATS = [
	"book",
	"manga",
	"audiobook",
	"ebook",
	"document"
];
var STATUSES = [
	"to_read",
	"reading",
	"finished",
	"abandoned"
];
var PRIORITIES = [
	"high",
	"medium",
	"low"
];
var SELECTION_MODES = [
	"vote",
	"raffle",
	"curator"
];
var formatMeta = {
	book: {
		label: "Livro",
		unit: "pages",
		unitLabel: "páginas",
		unitSingular: "página"
	},
	manga: {
		label: "Mangá / Novel",
		unit: "chapters",
		unitLabel: "capítulos",
		unitSingular: "capítulo"
	},
	audiobook: {
		label: "Audiolivro",
		unit: "minutes",
		unitLabel: "minutos",
		unitSingular: "minuto"
	},
	ebook: {
		label: "E-book",
		unit: "percent",
		unitLabel: "%",
		unitSingular: "%"
	},
	document: {
		label: "Documento",
		unit: "percent",
		unitLabel: "%",
		unitSingular: "%"
	}
};
var statusMeta = {
	to_read: { label: "A ler" },
	reading: { label: "Lendo" },
	finished: { label: "Lido" },
	abandoned: { label: "Pausado" }
};
var priorityMeta = {
	high: { label: "Alta" },
	medium: { label: "Média" },
	low: { label: "Baixa" }
};
var selectionMeta = {
	vote: {
		label: "Votação",
		hint: "Os membros votam nas obras indicadas."
	},
	raffle: {
		label: "Sorteio",
		hint: "O sistema escolhe ao acaso entre as indicações."
	},
	curator: {
		label: "Curadoria",
		hint: "O administrador define a próxima leitura."
	}
};
function unitForFormat(format) {
	return formatMeta[format].unit;
}
function progressLabel(progress, total, unit, ongoing) {
	if (unit === "percent") return `${Math.round(progress)}%`;
	if (unit === "minutes") {
		const h = Math.floor(progress / 60);
		const m = progress % 60;
		const consumed = h > 0 ? `${h}h ${m}min` : `${m} min`;
		if (ongoing || total <= 0) return consumed;
		const th = Math.floor(total / 60);
		const tm = total % 60;
		return `${consumed} / ${th > 0 ? `${th}h ${tm}min` : `${tm} min`}`;
	}
	const labels = {
		pages: "pág.",
		chapters: "cap.",
		minutes: "min",
		percent: "%"
	};
	if (ongoing || total <= 0) return `${progress} ${labels[unit]}`;
	return `${progress} / ${total} ${labels[unit]}`;
}
function percentOf(progress, total, ongoing) {
	if (ongoing) return null;
	if (total <= 0) return 0;
	return Math.round(Math.min(100, Math.max(0, progress / total * 100)));
}
//#endregion
export { formatMeta as a, progressLabel as c, unitForFormat as d, STATUSES as i, selectionMeta as l, PRIORITIES as n, percentOf as o, SELECTION_MODES as r, priorityMeta as s, FORMATS as t, statusMeta as u };
