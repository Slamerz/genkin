import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./index.module.css";

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={clsx("hero hero--primary", styles.heroBanner)}>
			<div className="container">
				<img src="/img/logo.svg" alt="Genkin Logo" width={100} height={100} />
				<Heading as="h1" className="hero__title">
					{siteConfig.title}
				</Heading>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<p className={styles.heroDescription}>
					Say goodbye to floating-point precision errors. Genkin provides
					rock-solid financial calculations with full TypeScript support and
					drop-in compatibility for existing Dinero.js projects.
				</p>
				<div className={styles.buttons}>
					<Link className="button button--primary button--lg" to="/docs/intro">
						Get Started
					</Link>
					<Link
						className="button button--secondary button--lg"
						to="/docs/core/getting-started"
					>
						Core API
					</Link>
				</div>
			</div>
		</header>
	);
}

function ValuePropositionSection() {
	return (
		<section className={styles.valueProposition}>
			<div className="container">
				<div className="text--center margin-bottom--xl">
					<Heading as="h2">Why Choose Genkin?</Heading>
					<p className="hero__subtitle">
						Built for developers who demand precision and reliability in
						financial calculations
					</p>
				</div>
				<div className="row">
					<div className="col col--4">
						<div className="text--center">
							<Heading as="h3">🔢 Perfect Precision</Heading>
							<p>
								Integer-based arithmetic eliminates floating-point errors. Your
								calculations will always be accurate, no matter how complex.
							</p>
						</div>
					</div>
					<div className="col col--4">
						<div className="text--center">
							<Heading as="h3">🔄 Drop-in Compatible</Heading>
							<p>
								Seamlessly migrate from Dinero.js v1 or v2. Keep your existing
								code while gaining better performance and TypeScript support.
							</p>
						</div>
					</div>
					<div className="col col--4">
						<div className="text--center">
							<Heading as="h3">⚡ TypeScript First</Heading>
							<p>
								Full type safety with excellent developer experience. Catch
								errors at compile time, not runtime.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function CodeExampleSection() {
	return (
		<section className={styles.codeExample}>
			<div className="container">
				<div className="row">
					<div className="col col--6">
						<Heading as="h2">Simple Yet Powerful</Heading>
						<p>
							Genkin's API is intuitive and familiar, whether you're using the
							core package or migrating from Dinero.js. Here are some common
							patterns:
						</p>
					</div>
					<div className="col col--6">
						<CodeBlock language="typescript" title="Basic Operations">
							{`import { genkin, add, USD } from '@genkin/core';

const price = genkin(1999, { currency: USD }); // $19.99
const tax = genkin(299, { currency: USD });    // $2.99
const total = add(price, tax);                 // $22.98

console.log(total.toString()); // "$22.98"`}
						</CodeBlock>
					</div>
				</div>
				<div className="row margin-top--lg">
					<div className="col col--6">
						<CodeBlock language="typescript" title="Dinero.js Migration">
							{`// Before (Dinero.js v1)
import { Dinero } from 'dinero.js';
const amount = Dinero({ amount: 1000, currency: 'USD' });

// After (@genkin/dinero)
import { Dinero } from '@genkin/dinero';
import { USD } from '@genkin/currencies';
const amount = Dinero({ amount: 1000, currency: USD });`}
						</CodeBlock>
					</div>
					<div className="col col--6">
						<CodeBlock language="typescript" title="Generic Types">
							{`import { dinero, add } from '@genkin/dinero-v2';

// Works with BigInt for unlimited precision
const price = dinero({
  amount: 1000000000n,
  currency: USD,
  scale: 2n
});

// Or with Big.js for decimal precision
const rate = dinero({
  amount: new BigJs('1.0599'),
  currency: USD,
  scale: 4
});`}
						</CodeBlock>
					</div>
				</div>
			</div>
		</section>
	);
}

function GettingStartedSection() {
	return (
		<section className={styles.gettingStarted}>
			<div className="container">
				<div className="text--center margin-bottom--xl">
					<Heading as="h2">Get Started in Minutes</Heading>
					<p>Choose the packages that fit your needs</p>
				</div>
				<div className="row">
					<div className="col col--6">
						<div className={styles.installCard}>
							<Heading as="h3">For New Projects</Heading>
							<CodeBlock language="bash">
								{`# Install core and currencies
bun add @genkin/core @genkin/currencies`}
							</CodeBlock>
							<p>
								Perfect for new applications requiring precise financial
								calculations.
							</p>
						</div>
					</div>
					<div className="col col--6">
						<div className={styles.installCard}>
							<Heading as="h3">Migrating from Dinero.js?</Heading>
							<CodeBlock language="bash">
								{`# For Dinero.js v1 projects
bun add @genkin/dinero @genkin/currencies

# For Dinero.js v2 projects
bun add @genkin/dinero-v2 @genkin/currencies`}
							</CodeBlock>
							<p>
								Drop-in replacements with enhanced performance and TypeScript
								support.
							</p>
						</div>
					</div>
				</div>
				<div className="text--center margin-top--xl">
					<Link className="button button--primary button--lg" to="/docs/intro">
						Read the Docs →
					</Link>
				</div>
			</div>
		</section>
	);
}

export default function Home(): ReactNode {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={`Hello from ${siteConfig.title}`}
			description="High-precision currency and money calculations in TypeScript. Drop-in replacements for Dinero.js with enhanced performance and type safety."
		>
			<HomepageHeader />
			<main>
				<HomepageFeatures />
				<ValuePropositionSection />
				<CodeExampleSection />
				<GettingStartedSection />
			</main>
		</Layout>
	);
}
