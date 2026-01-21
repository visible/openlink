const pattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

export function parseJsonLd(html) {
	const results = [];
	let match;

	while ((match = pattern.exec(html)) !== null) {
		try {
			const data = JSON.parse(match[1].trim());
			if (Array.isArray(data)) {
				results.push(...data);
			} else {
				results.push(data);
			}
		} catch {
			continue;
		}
	}

	pattern.lastIndex = 0;
	return results;
}

export function extractJsonLd(items) {
	if (!items.length) return null;

	const result = {
		types: [],
		data: items,
	};

	for (const item of items) {
		const type = item["@type"];
		if (type) {
			const types = Array.isArray(type) ? type : [type];
			for (const t of types) {
				if (!result.types.includes(t)) {
					result.types.push(t);
				}
			}
		}
	}

	const article = items.find((i) =>
		i["@type"] === "Article" ||
		i["@type"] === "NewsArticle" ||
		i["@type"] === "BlogPosting"
	);

	if (article) {
		result.article = {
			headline: article.headline || null,
			description: article.description || null,
			author: extractAuthor(article.author),
			publisher: extractPublisher(article.publisher),
			datePublished: article.datePublished || null,
			dateModified: article.dateModified || null,
			image: extractImage(article.image),
		};
	}

	const product = items.find((i) => i["@type"] === "Product");
	if (product) {
		result.product = {
			name: product.name || null,
			description: product.description || null,
			image: extractImage(product.image),
			brand: product.brand?.name || product.brand || null,
			price: extractPrice(product.offers),
			rating: extractRating(product.aggregateRating),
		};
	}

	const org = items.find((i) => i["@type"] === "Organization");
	if (org) {
		result.organization = {
			name: org.name || null,
			url: org.url || null,
			logo: extractImage(org.logo),
		};
	}

	const video = items.find((i) => i["@type"] === "VideoObject");
	if (video) {
		result.video = {
			name: video.name || null,
			description: video.description || null,
			thumbnail: extractImage(video.thumbnailUrl),
			duration: video.duration || null,
			uploadDate: video.uploadDate || null,
		};
	}

	const breadcrumbs = items.find((i) => i["@type"] === "BreadcrumbList");
	if (breadcrumbs?.itemListElement) {
		result.breadcrumbs = breadcrumbs.itemListElement
			.sort((a, b) => (a.position || 0) - (b.position || 0))
			.map((item) => ({
				name: item.name || item.item?.name || null,
				url: item.item?.["@id"] || item.item || null,
			}));
	}

	return result;
}

function extractAuthor(author) {
	if (!author) return null;
	if (typeof author === "string") return author;
	if (Array.isArray(author)) return author.map((a) => a.name || a).join(", ");
	return author.name || null;
}

function extractPublisher(publisher) {
	if (!publisher) return null;
	return {
		name: publisher.name || null,
		logo: extractImage(publisher.logo),
	};
}

function extractImage(image) {
	if (!image) return null;
	if (typeof image === "string") return image;
	if (Array.isArray(image)) return image[0]?.url || image[0] || null;
	return image.url || image["@id"] || null;
}

function extractPrice(offers) {
	if (!offers) return null;
	const offer = Array.isArray(offers) ? offers[0] : offers;
	if (!offer) return null;
	return {
		amount: offer.price || null,
		currency: offer.priceCurrency || null,
		availability: offer.availability?.replace("https://schema.org/", "") || null,
	};
}

function extractRating(rating) {
	if (!rating) return null;
	return {
		value: rating.ratingValue || null,
		count: rating.reviewCount || rating.ratingCount || null,
	};
}
