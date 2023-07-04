declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.svg';

declare module '*.module.css' {
	const mapping: Mapping;
	export default mapping;
}