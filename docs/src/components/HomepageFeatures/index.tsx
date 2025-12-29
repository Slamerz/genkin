import Heading from "@theme/Heading";
import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./styles.module.css";

type FeatureItem = {
	title: string;
	Svg?: React.ComponentType<React.ComponentProps<"svg">>;
	description: ReactNode;
};

const FeatureList: FeatureItem[] = [
	{
		title: "@genkin/core",
		description: (
			<>
				The foundation of Genkin. High-precision arithmetic with integer-based
				calculations, currency formatting, and generic numeric type support for
				maximum accuracy and performance.
			</>
		),
	},
	{
		title: "@genkin/currencies",
		description: (
			<>
				Complete ISO 4217 currency support with 180+ currencies. Type-safe
				currency codes, automatic formatting, and seamless integration with the
				currency registry.
			</>
		),
	},
	{
		title: "Dinero.js Compatibility",
		description: (
			<>
				Drop-in replacements for Dinero.js v1 and v2. Migrate existing projects
				effortlessly while gaining better performance and TypeScript support.
			</>
		),
	},
];

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className={clsx("col col--4")}>
			<div className="text--center">
				{Svg && <Svg className={styles.featureSvg} role="img" />}
			</div>
			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures(): ReactNode {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={props.title} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
