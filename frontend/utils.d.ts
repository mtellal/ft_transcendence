declare module '*.png';
declare module '*.jpeg';

declare module '*.module.css' {
	const mapping: Mapping;
	export default mapping;
}