import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const config = {
	transpilePackages: ["openlink"],
	devIndicators: false,
	turbopack: {},
	images: {
		unoptimized: true,
	},
};

export default withMDX(config);
